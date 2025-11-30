import type { Response } from "express";
import { COOKIE_OPTIONS } from "../../../common/constants/cookieOptions";
import {
	ErrorMessage,
	HttpStatus,
	ResponseMessage,
} from "../../../common/enums";
import type {
	IAuthService,
	IPasswordResetService,
} from "../../../domain/services";

import env from "../../../infrastructure/config/env";
import asyncHandler from "../utils/asyncHandler";

import {
	loginSchema,
	resendOtpSchema,
	resetSchema,
	updatePasswordSchema,
	verifyOtpSchema,
} from "../validations/auth.validation";

/**
 * AuthController
 * Handles all authentication, registration and password-reset related routes.
 */
export class AuthController {
	constructor(
		private _authService: IAuthService,
		private _passwordResetService: IPasswordResetService,
	) {}

	// ─────────────────────────────────────────────────────────────
	// Cookie Helpers
	// ─────────────────────────────────────────────────────────────

	/** Sets access & refresh token cookies */
	private setAuthCookies(
		res: Response,
		accessToken: string,
		refreshToken: string,
	) {
		res.cookie("accesstoken", accessToken, {
			...COOKIE_OPTIONS,
			maxAge: parseInt(env.ACCESS_TOKEN_EXPIRY),
		});

		res.cookie("refreshtoken", refreshToken, {
			...COOKIE_OPTIONS,
			maxAge: parseInt(env.REFRESH_TOKEN_EXPIRY),
		});
	}

	/** Sets registration or reset OTP token cookie */
	private setTokenCookie(
		res: Response,
		type: "reset" | "register",
		token: string,
	) {
		const cookieName = type === "reset" ? "resettoken" : "registertoken";
		res.cookie(cookieName, token, {
			...COOKIE_OPTIONS,
			maxAge: parseInt(env.RESET_TOKEN_EXPIRY),
		});
	}

	/** Clears registration or reset OTP cookies */
	private clearTokenCookie(res: Response, type: "reset" | "register") {
		res.clearCookie(type === "reset" ? "resettoken" : "registertoken");
	}

	/** Clears authentication cookies */
	private clearAuthCookies(res: Response) {
		res.clearCookie("accesstoken");
		res.clearCookie("refreshtoken");
	}

	// ─────────────────────────────────────────────────────────────
	// Authentication
	// ─────────────────────────────────────────────────────────────

	/** Login user & set tokens */
	login = asyncHandler(async (req, res) => {
		const { email, password } = loginSchema.parse(req.body);
		const { user, accessToken, refreshToken } =
			await this._authService.loginUser(email, password);

		this.setAuthCookies(res, accessToken, refreshToken);

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.LOGIN_SUCCESS, user });
	});

	/** Logout user & clear cookies */
	logout = asyncHandler(async (_req, res) => {
		const userId = res.locals?.user?.id;
		this._authService.logout(userId);
		this.clearAuthCookies(res);

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.LOGOUT_SUCCESS });
	});

	/** Refresh access token */
	refreshToken = asyncHandler(async (req, res) => {
		const refreshTokenFromCookie = req.cookies.refreshtoken;

		if (!refreshTokenFromCookie) {
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: ErrorMessage.INVALID_REFRESH_TOKEN,
			});
		}

		const { accessToken, refreshToken } =
			await this._authService.refreshAccessToken(refreshTokenFromCookie);

		this.setAuthCookies(res, accessToken, refreshToken);

		return res.status(HttpStatus.OK).json({
			success: true,
			message: ResponseMessage.REFRESH_TOKEN_SUCCESS,
		});
	});

	/** Returns logged-in user's profile */
	me = asyncHandler(async (_req, res) => {
		const userId = res.locals.user.id;
		const user = await this._authService.getUser(userId);
		res.status(HttpStatus.OK).json({ success: true, user });
	});

	// ─────────────────────────────────────────────────────────────
	// Registration
	// ─────────────────────────────────────────────────────────────

	/** Google OAuth flow */
	googleAuth = asyncHandler(async (req, res) => {
		const { credential } = req.body;

		const result = await this._authService.googleAuthenticate(credential);

		if ("token" in result) {
			// New Google user → store registration token
			this.setTokenCookie(res, "register", result.token);

			return res.status(HttpStatus.OK).json({
				success: true,
				message: ResponseMessage.USER_REGISTERED,
				email: result.email,
			});
		}

		// Existing user → login
		const { user, accessToken, refreshToken } = result;

		this.setAuthCookies(res, accessToken, refreshToken);

		return res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.LOGIN_SUCCESS, user });
	});

	// ─────────────────────────────────────────────────────────────
	// Password Reset
	// ─────────────────────────────────────────────────────────────

	/** Initiate password reset → send OTP */
	reset = asyncHandler(async (req, res) => {
		const { email } = resetSchema.parse(req.body);

		await this._passwordResetService.initiatePasswordReset(email);

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.OTP_SENT });
	});

	/** Verify password reset OTP */
	verifyResetOtp = asyncHandler(async (req, res) => {
		const { email, otp } = verifyOtpSchema.parse(req.body);

		const token = await this._passwordResetService.verifyResetOtp(email, otp);

		this.setTokenCookie(res, "reset", token);

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.OTP_VERIFIED });
	});

	/** Resend password reset OTP */
	resendResetOtp = asyncHandler(async (req, res) => {
		const { email } = resendOtpSchema.parse(req.body);

		await this._passwordResetService.resendResetOtp(email);

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.OTP_SENT });
	});

	/** Update password after reset */
	updatePassword = asyncHandler(async (req, res) => {
		const resetToken = req.cookies.resettoken;

		const { email, newPassword } = updatePasswordSchema.parse(req.body);

		await this._passwordResetService.updatePassword(
			email,
			newPassword,
			resetToken,
		);

		this.clearTokenCookie(res, "reset");

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.PASSWORD_UPDATED });
	});
}

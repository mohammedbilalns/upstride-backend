import type { Response } from "express";
import { COOKIE_OPTIONS } from "../../../common/constants/cookieOptions";
import {
	ErrorMessage,
	HttpStatus,
	ResponseMessage,
} from "../../../common/enums";

import env from "../../../infrastructure/config/env";
import asyncHandler from "../utils/asyncHandler";

import { loginSchema } from "../validations/auth.validation";
import {
	IGetUserUC,
	IGoogleAuthenticateUC,
	ILoginUserUC,
	ILogoutUC,
	IRefreshTokenUC,
} from "../../../domain/useCases/auth";

/**
 * AuthController
 * Handles all authentication, registration and password-reset related routes.
 */
export class AuthController {
	constructor(
		private _loginUserUC: ILoginUserUC,
		private _logoutUC: ILogoutUC,
		private _refreshTokenUC: IRefreshTokenUC,
		private _googleAuthenticateUC: IGoogleAuthenticateUC,
		private _getUserUC: IGetUserUC,
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

	/** Clears authentication cookies */
	private clearAuthCookies(res: Response) {
		res.clearCookie("accesstoken");
		res.clearCookie("refreshtoken");
	}

	// ─────────────────────────────────────────────────────────────
	// Authentication
	// ─────────────────────────────────────────────────────────────

	/** Login user & set tokens */
	public login = asyncHandler(async (req, res) => {
		const { email, password } = loginSchema.parse(req.body);
		const { user, accessToken, refreshToken } = await this._loginUserUC.execute(
			{
				email,
				password,
			},
		);

		this.setAuthCookies(res, accessToken, refreshToken);

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.LOGIN_SUCCESS, user });
	});

	/** Logout user & clear cookies */
	public logout = asyncHandler(async (_req, res) => {
		const userId = res.locals?.user?.id;
		this._logoutUC.execute({ userId });
		this.clearAuthCookies(res);

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.LOGOUT_SUCCESS });
	});

	/** Refresh access token */
	public refreshToken = asyncHandler(async (req, res) => {
		const refreshTokenFromCookie = req.cookies.refreshtoken;

		if (!refreshTokenFromCookie) {
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: ErrorMessage.INVALID_REFRESH_TOKEN,
			});
		}

		const { accessToken, refreshToken } = await this._refreshTokenUC.execute({
			refreshToken: refreshTokenFromCookie,
		});

		this.setAuthCookies(res, accessToken, refreshToken);

		return res.status(HttpStatus.OK).json({
			success: true,
			message: ResponseMessage.REFRESH_TOKEN_SUCCESS,
		});
	});

	/** Returns logged-in user's profile */
	public me = asyncHandler(async (_req, res) => {
		const userId = res.locals.user.id;
		const user = await this._getUserUC.execute({ userId });
		res.status(HttpStatus.OK).json({ success: true, user });
	});

	// ─────────────────────────────────────────────────────────────
	// Registration
	// ─────────────────────────────────────────────────────────────

	/** Google OAuth flow */
	public googleAuth = asyncHandler(async (req, res) => {
		const { credential } = req.body;

		const result = await this._googleAuthenticateUC.execute({
			token: credential,
		});

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
}

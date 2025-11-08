import type { Response as Response } from "express";
import { COOKIE_OPTIONS } from "../../../common/constants/cookieOptions";
import {
	ErrorMessage,
	HttpStatus,
	ResponseMessage,
} from "../../../common/enums";
import type {
	IAuthService,
	IPasswordResetService,
	IRegistrationService,
} from "../../../domain/services";
import env from "../../../infrastructure/config/env";
import asyncHandler from "../utils/asyncHandler";
import {
	loginSchema,
	registerSchema,
	resendOtpSchema,
	resetSchema,
	updatePasswordSchema,
	verifyOtpSchema,
} from "../validations/auth.validation";
import { addInterestsSchema } from "../validations/interests.validation";

export class AuthController {
	constructor(
		private _authService: IAuthService,
		private _registrationService: IRegistrationService,
		private _passwordResetService: IPasswordResetService,
	) {}

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
	private clearTokenCookie(res: Response, type: "reset" | "register") {
		res.clearCookie(type === "reset" ? "resettoken" : "registertoken");
	}

	private clearAuthCookies(res: Response) {
		res.clearCookie("accesstoken");
		res.clearCookie("refreshtoken");
	}

	login = asyncHandler(async (req, res) => {
		const { email, password } = loginSchema.parse(req.body);
		const { user, accessToken, refreshToken } =
			await this._authService.loginUser(email, password);
		this.setAuthCookies(res, accessToken, refreshToken);
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.LOGIN_SUCCESS, user });
	});

	register = asyncHandler(async (req, res) => {
		const { name, email, phone, password } = registerSchema.parse(req.body);
		await this._registrationService.registerUser(name, email, phone, password);
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.OTP_SENT });
	});

	googleAuth = asyncHandler(async (req, res) => {
		const { credential } = req.body;

		const result = await this._authService.googleAuthenticate(credential);
		if ("token" in result) {
			this.setTokenCookie(res, "register", result.token);
			return res.status(HttpStatus.OK).json({
				success: true,
				message: ResponseMessage.USER_REGISTERED,
				email: result.email,
			});
		}
		const { user, accessToken, refreshToken } = result;

		this.setAuthCookies(res, accessToken, refreshToken);
		return res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.LOGIN_SUCCESS, user });
	});

	verifyOtp = asyncHandler(async (req, res) => {
		const { email, otp } = verifyOtpSchema.parse(req.body);
		const token = await this._registrationService.verifyOtp(email, otp);
		this.setTokenCookie(res, "register", token);
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.OTP_VERIFIED });
	});

	resendOtp = asyncHandler(async (req, res) => {
		const { email } = resendOtpSchema.parse(req.body);
		await this._registrationService.resendRegisterOtp(email);
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.OTP_RESENT });
	});

	logout = asyncHandler(async (_req, res) => {
		console.log(res.locals);
		const userId = res.locals?.user?.id;
		this._authService.logout(userId);
		this.clearAuthCookies(res);
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.LOGOUT_SUCCESS });
	});

	reset = asyncHandler(async (req, res) => {
		const { email } = resetSchema.parse(req.body);
		await this._passwordResetService.initiatePasswordReset(email);
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.OTP_SENT });
	});

	verifyResetOtp = asyncHandler(async (req, res) => {
		const { email, otp } = verifyOtpSchema.parse(req.body);
		const token = await this._passwordResetService.verifyResetOtp(email, otp);
		this.setTokenCookie(res, "reset", token);
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.OTP_VERIFIED });
	});

	resendResetOtp = asyncHandler(async (req, res) => {
		const { email } = resendOtpSchema.parse(req.body);
		await this._passwordResetService.resendResetOtp(email);
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.OTP_SENT });
	});

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

	addInterests = asyncHandler(async (req, res) => {
		const { selectedAreas, selectedTopics, email } = addInterestsSchema.parse(
			req.body,
		);

		const token = req.cookies.registertoken;
		await this._registrationService.createInterests(
			email,
			selectedAreas,
			selectedTopics,
			token,
		);
		this.clearTokenCookie(res, "register");
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.INTERESTS_ADDED });
	});

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

	me = asyncHandler(async (_req, res) => {
		const userId = res.locals.user.id;
		const user = await this._authService.getUser(userId);
		res.status(HttpStatus.OK).json({ success: true, user });
	});
}

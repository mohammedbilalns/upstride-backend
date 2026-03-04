import type { Response } from "express";
import { inject, injectable } from "inversify";
import { UAParser } from "ua-parser-js";
import { UnauthorizedError } from "../../../application/authentication/errors";
import type { ILoginWithEmailUseCase } from "../../../application/authentication/use-cases/login/login-with-email.usecase.interface";
import type { ILogoutUseCase } from "../../../application/authentication/use-cases/logout/logout.usecase.interface";
import type { IRefreshSessionUseCase } from "../../../application/authentication/use-cases/refresh-session/refresh-session.usecase.interface";
import type { IRegisterWithEmailUseCase } from "../../../application/authentication/use-cases/registration/register-with-email.usecase.interface";
import type { IResendOtpUseCase } from "../../../application/authentication/use-cases/resend-otp.usecase.interface";
import type { IVerifyOtpUseCase } from "../../../application/authentication/use-cases/verify-otp.usecase.interface";
import { OtpPurpose } from "../../../domain/policies/otp-purposes";
import env from "../../../shared/config/env";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { AuthResponseMessages } from "../constants/response-messages";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class AuthController {
	constructor(
		@inject(TYPES.UseCases.LoginWithEmail)
		private _loginWithEmailUseCase: ILoginWithEmailUseCase,
		@inject(TYPES.UseCases.RegisterWithEmail)
		private _registerWithEmailUseCase: IRegisterWithEmailUseCase,
		@inject(TYPES.UseCases.VerifyOtp)
		private _verifyOtpUseCase: IVerifyOtpUseCase,
		@inject(TYPES.UseCases.ResendOtp)
		private _resendOtpUseCase: IResendOtpUseCase,
		@inject(TYPES.UseCases.RefreshSession)
		private _refreshSessionUseCase: IRefreshSessionUseCase,
		@inject(TYPES.UseCases.Logout)
		private _logoutUseCase: ILogoutUseCase,
	) {}

	register = asyncHandler(async (req, res) => {
		await this._registerWithEmailUseCase.execute(req.body);

		sendSuccess(res, HttpStatus.CREATED, {
			message: AuthResponseMessages.REGISTER_SUCCESS,
		});
	});

	verifyRegisterOtp = asyncHandler(async (req, res) => {
		const data = await this._verifyOtpUseCase.execute({
			...req.body,
			type: OtpPurpose.REGISTER,
		});

		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.OTP_VERIFIED,
			data,
		});
	});

	resendRegisterOtp = asyncHandler(async (req, res) => {
		await this._resendOtpUseCase.execute({
			...req.body,
			type: OtpPurpose.REGISTER,
		});

		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.OTP_RESENT,
		});
	});

	login = asyncHandler(async (req, res) => {
		const userAgent = req.headers["user-agent"] || ("unknown" as string);
		const ua = new UAParser(userAgent);
		const deviceType = ua.getDevice().type;
		const vendorName = ua.getDevice().vendor;
		const model = ua.getDevice().model;
		const osName = ua.getOS().name;

		const { refreshToken, ...data } = await this._loginWithEmailUseCase.execute(
			{
				...req.body,
				deviceType: deviceType || "unknown",
				deviceVendor: vendorName || "unknown",
				deviceModel: model || "unknown",
				deviceOs: osName || "unknown",
				ipAddress: req.ip || req.socket?.remoteAddress || "unknown",
				userAgent: userAgent,
			},
		);

		this._setRefreshTokenCookie(res, refreshToken);
		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.LOGIN_SUCCESS,
			data,
		});
	});

	refreshSession = asyncHandler(async (req, res) => {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			throw new UnauthorizedError();
		}
		const { refreshToken: newRefreshToken, ...data } =
			await this._refreshSessionUseCase.execute({ refreshToken });

		this._setRefreshTokenCookie(res, newRefreshToken);

		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.REFRESH_SESSION_SUCCESS,
			data,
		});
	});

	logout = asyncHandler(async (req: AuthenticatedRequest, res) => {
		const sessionId = req.user.sid;

		await this._logoutUseCase.execute({ sessionId });

		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: env.NODE_ENV === "production",
			sameSite: "strict",
		});

		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.LOGOUT_SUCCESS,
		});
	});

	private _setRefreshTokenCookie(res: Response, token: string) {
		res.cookie("refreshToken", token, {
			httpOnly: true,
			secure: env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
	}
}

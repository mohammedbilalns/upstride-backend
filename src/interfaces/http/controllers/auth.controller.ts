import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { UAParser } from "ua-parser-js";
import { UnauthorizedError } from "../../../application/authentication/errors";
import type { ILoginWithEmailUseCase } from "../../../application/authentication/use-cases/login/login-with-email.usecase.interface";
import type { IRefreshSessionUseCase } from "../../../application/authentication/use-cases/refresh-session/refresh-session.usecase.interface";
import type { IRegisterWithEmailUseCase } from "../../../application/authentication/use-cases/registration/register-with-email.usecase.interface";
import type { IResendOtpUseCase } from "../../../application/authentication/use-cases/resend-otp.usecase.interface";
import type { ISaveUserInterestsUseCase } from "../../../application/authentication/use-cases/save-user-interests/save-user-interests.usecase.interface";
import type { IVerifyOtpUseCase } from "../../../application/authentication/use-cases/verify-otp.usecase.interface";
import { OtpPurpose } from "../../../domain/policies/otp-purposes";
import env from "../../../shared/config/env";
import { HttpStatus } from "../../../shared/constants";
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
		@inject(TYPES.UseCases.SaveUserInterests)
		private _saveUserInterestsUseCase: ISaveUserInterestsUseCase,
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
		const deviceInfo = this._extractDeviceInfo(req);

		const { refreshToken, ...data } = await this._loginWithEmailUseCase.execute(
			{
				...req.body,
				...deviceInfo,
			},
		);

		this._setRefreshTokenCookie(res, refreshToken);
		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.LOGIN_SUCCESS,
			data,
		});
	});

	saveInterests = asyncHandler(async (req, res) => {
		const deviceInfo = this._extractDeviceInfo(req);

		const { refreshToken, ...data } =
			await this._saveUserInterestsUseCase.execute({
				...req.body,
				...deviceInfo,
			});

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

	private _setRefreshTokenCookie(res: Response, token: string) {
		res.cookie("refreshToken", token, {
			httpOnly: true,
			secure: env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
	}

	private _extractDeviceInfo(req: Request) {
		const userAgent = req.headers["user-agent"] || ("unknown" as string);
		const ua = new UAParser(userAgent);
		const deviceType = ua.getDevice().type || "unknown";
		const deviceVendor = ua.getDevice().vendor || "unknown";
		const deviceModel = ua.getDevice().model || "unknown";
		const deviceOs = ua.getOS().name || "unknown";
		const ipAddress = req.ip || req.socket?.remoteAddress || "unknown";

		return {
			deviceType,
			deviceVendor,
			deviceModel,
			deviceOs,
			ipAddress,
			userAgent,
		};
	}
}

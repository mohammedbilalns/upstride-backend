import type { Response } from "express";
import { inject, injectable } from "inversify";
import type {
	ILoginWithEmailUseCase,
	IRefreshSessionUseCase,
	IRegisterWithEmailUseCase,
	IResendOtpUseCase,
	ISaveUserInterestsUseCase,
	ISocialLoginUseCase,
	IVerifyOtpUseCase,
} from "../../../application/modules/authentication/use-cases";
import { OtpPurpose } from "../../../domain/policies/otp-purposes";
import env from "../../../shared/config/env";
import { HttpStatus } from "../../../shared/constants";
import { TYPES } from "../../../shared/types/types";
import { extractDeviceInfo } from "../../../shared/utilities/extract-device-info.util";
import { AuthResponseMessages } from "../constants";
import { asyncHandler, sendSuccess } from "../helpers";
import type {
	GoogleLoginBody,
	LinkedInLoginBody,
	LoginBody,
	RegisterBody,
	ResendOtpBody,
	SaveInterestsBody,
	VerifyOtpBody,
} from "../validators/auth";

@injectable()
export class AuthController {
	constructor(
		@inject(TYPES.UseCases.LoginWithEmail)
		private _loginWithEmailUseCase: ILoginWithEmailUseCase,
		@inject(TYPES.UseCases.SocialLogin)
		private _socialLoginUseCase: ISocialLoginUseCase,
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
		await this._registerWithEmailUseCase.execute(
			req.validated?.body as RegisterBody,
		);

		sendSuccess(res, HttpStatus.CREATED, {
			message: AuthResponseMessages.REGISTER_SUCCESS,
		});
	});

	verifyRegisterOtp = asyncHandler(async (req, res) => {
		const data = await this._verifyOtpUseCase.execute({
			...(req.validated?.body as VerifyOtpBody),
			type: OtpPurpose.REGISTER,
		});

		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.OTP_VERIFIED,
			data,
		});
	});

	resendRegisterOtp = asyncHandler(async (req, res) => {
		await this._resendOtpUseCase.execute({
			...(req.validated?.body as ResendOtpBody),
			type: OtpPurpose.REGISTER,
		});

		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.OTP_RESENT,
		});
	});

	login = asyncHandler(async (req, res) => {
		const deviceInfo = extractDeviceInfo(req);

		const { refreshToken, ...data } = await this._loginWithEmailUseCase.execute(
			{
				...(req.validated?.body as LoginBody),
				...deviceInfo,
			},
		);

		this._setRefreshTokenCookie(res, refreshToken);
		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.LOGIN_SUCCESS,
			data,
		});
	});

	loginWithGoogle = asyncHandler(async (req, res) => {
		const deviceInfo = extractDeviceInfo(req);
		const data = await this._socialLoginUseCase.execute({
			provider: "GOOGLE",
			credential: (req.validated?.body as GoogleLoginBody).code,
			...deviceInfo,
		});

		if ("refreshToken" in data) {
			this._setRefreshTokenCookie(res, data.refreshToken);
		}
		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.LOGIN_SUCCESS,
			data:
				"refreshToken" in data
					? (({ refreshToken, ...rest }) => rest)(data)
					: data,
		});
	});

	loginWithLinkedIn = asyncHandler(async (req, res) => {
		const deviceInfo = extractDeviceInfo(req);
		const body = req.validated?.body as LinkedInLoginBody;

		const data = await this._socialLoginUseCase.execute({
			provider: "LINKEDIN",
			credential: `${body.code}::${body.redirectUri}`,
			...deviceInfo,
		});

		if ("refreshToken" in data) {
			this._setRefreshTokenCookie(res, data.refreshToken);
		}
		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.LOGIN_SUCCESS,
			data:
				"refreshToken" in data
					? (({ refreshToken, ...rest }) => rest)(data)
					: data,
		});
	});

	saveInterests = asyncHandler(async (req, res) => {
		const deviceInfo = extractDeviceInfo(req);

		const { refreshToken, ...data } =
			await this._saveUserInterestsUseCase.execute({
				...(req.validated?.body as SaveInterestsBody),
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
}

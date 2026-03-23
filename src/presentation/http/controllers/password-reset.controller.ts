import { inject, injectable } from "inversify";
import type {
	IResendResetPasswordOtpUseCase,
	IVerifyResetPasswordOtpUseCase,
} from "../../../application/modules/authentication/use-cases";
import type {
	IRequestPasswordResetUseCase,
	IUpdatePasswordUseCase,
} from "../../../application/modules/authentication/use-cases/password-reset";
import { HttpStatus } from "../../../shared/constants";
import { TYPES } from "../../../shared/types/types";
import { AuthResponseMessages } from "../constants";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class PasswordResetController {
	constructor(
		@inject(TYPES.UseCases.RequestPasswordReset)
		private _requestPasswordResetUseCase: IRequestPasswordResetUseCase,
		@inject(TYPES.UseCases.VerifyResetPasswordOtp)
		private _verifyResetPasswordOtpUseCase: IVerifyResetPasswordOtpUseCase,
		@inject(TYPES.UseCases.ResendResetPasswordOtp)
		private _resendResetPasswordOtpUseCase: IResendResetPasswordOtpUseCase,
		@inject(TYPES.UseCases.UpdatePassword)
		private _updatePasswordUseCase: IUpdatePasswordUseCase,
	) {}

	requestPasswordReset = asyncHandler(async (req, res) => {
		await this._requestPasswordResetUseCase.execute(req.body);

		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.RESET_OTP_SEND,
		});
	});

	verifyResetPasswordOtp = asyncHandler(async (req, res) => {
		const data = await this._verifyResetPasswordOtpUseCase.execute({
			...req.body,
		});

		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.OTP_VERIFIED,
			data,
		});
	});

	resendResetPasswordOtp = asyncHandler(async (req, res) => {
		await this._resendResetPasswordOtpUseCase.execute({
			...req.body,
		});
		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.OTP_RESENT,
		});
	});

	updatePassword = asyncHandler(async (req, res) => {
		await this._updatePasswordUseCase.execute(req.body);

		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.PASSWORD_CHANGED,
		});
	});
}

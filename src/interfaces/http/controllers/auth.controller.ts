import { inject, injectable } from "inversify";
import type { ILoginWithEmailUseCase } from "../../../application/authentication/use-cases/login/login-with-email.usecase.interface";
import type { IRequestPasswordResetUseCase } from "../../../application/authentication/use-cases/password-reset";
import type { IRegisterWithEmailUseCase } from "../../../application/authentication/use-cases/registration/register-with-email.usecase.interface";
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
		@inject(TYPES.UseCases.RequestPasswordReset)
		private _requestPasswordResetUseCase: IRequestPasswordResetUseCase,
	) {}

	register = asyncHandler(async (req, res) => {
		await this._registerWithEmailUseCase.execute(req.body);

		sendSuccess(res, HttpStatus.CREATED, {
			message: AuthResponseMessages.REGISTER_SUCCESS,
		});
	});

	login = asyncHandler(async (req, res) => {
		const data = await this._loginWithEmailUseCase.execute(req.body);

		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.LOGIN_SUCCESS,
			data,
		});
	});

	requestPasswordReset = asyncHandler(async (req, res) => {
		await this._requestPasswordResetUseCase.execute(req.body);

		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.RESET_OTP_SEND,
		});
	});
}

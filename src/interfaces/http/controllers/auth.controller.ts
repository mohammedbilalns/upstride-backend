import { inject, injectable } from "inversify";
import type { ILoginWithEmailUseCase } from "../../../application/authentication/use-cases/login/login-with-email.usecase.interface";
import { HttpStatus } from "../../../shared/constants";
import { TYPES } from "../../../shared/types/types";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class AuthController {
	constructor(
		@inject(TYPES.UseCases.LoginWithEmail)
		private _loginWithEmailUseCase: ILoginWithEmailUseCase,
	) {}

	login = asyncHandler(async (req, res) => {
		const data = await this._loginWithEmailUseCase.execute(req.body);

		sendSuccess(res, HttpStatus.OK, {
			message: "Login Successful",
			data,
		});
	});
}

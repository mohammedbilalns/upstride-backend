import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IPasswordService } from "../../../services";
import type { LoginResponse, LoginWithEmailInput } from "../../dtos";
import { AuthenticationError } from "../../errors/authentication.error";
import type { IAuthSessionService } from "../../services/auth-session.service.interface";
import {
	assertAuthenticationAllowed,
	resolveAuthenticationStatus,
} from "../helpers/assert-user-can-authenticate";
import type { ILoginWithEmailUseCase } from ".";

@injectable()
export class LoginWithEmailUseCase implements ILoginWithEmailUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private _userRepository: IUserRepository,
		@inject(TYPES.Services.Password)
		private _passwordService: IPasswordService,
		@inject(TYPES.Services.AuthSession)
		private _authSessionService: IAuthSessionService,
	) {}

	async execute(input: LoginWithEmailInput): Promise<LoginResponse> {
		const existingUser = await this._userRepository.findByEmail(input.email);

		if (!existingUser) {
			await this._passwordService.fakeVerify();
			throw new AuthenticationError();
		}

		if (existingUser.authType !== "LOCAL") {
			await this._passwordService.fakeVerify();
			throw new AuthenticationError();
		}

		const authenticationStatus = resolveAuthenticationStatus(existingUser);

		if (authenticationStatus === "unverified") {
			await this._passwordService.fakeVerify();
		}

		assertAuthenticationAllowed(authenticationStatus);

		const isPasswordCorrect = await this._passwordService.verifyPassword(
			input.password,
			existingUser.passwordHash,
		);

		if (!isPasswordCorrect) throw new AuthenticationError();

		return this._authSessionService.createLoginResponse(existingUser, input);
	}
}

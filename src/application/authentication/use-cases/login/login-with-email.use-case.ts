import { randomUUID } from "node:crypto";
import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../../../domain/repositories";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";
import type { IPasswordHasherService, ITokenService } from "../../../services";
import type { LoginResponse, LoginWithEmailInput } from "../../dtos/login.dto";
import { AuthenticationError } from "../../errors/authentication.error";
import { LoginResponseMapper } from "../../mappers/login-response.mapper";
import type { ILoginWithEmailUseCase } from "./login-with-email.usecase.interface";

@injectable()
export class LoginWithEmailUseCase implements ILoginWithEmailUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private _userRepository: IUserRepository,
		@inject(TYPES.Services.PasswordHasher)
		private _passwordHasherService: IPasswordHasherService,
		@inject(TYPES.Services.TokenService) private _tokenService: ITokenService,
	) {}

	//TODO : add measures to handle timing attacks
	async execute(input: LoginWithEmailInput): Promise<LoginResponse> {
		logger.debug({ input }, "LoginWithEmailUseCase.execute");
		const existingUser = await this._userRepository.findByEmail(input.email);

		if (!existingUser) throw new AuthenticationError();

		if (existingUser.isBlocked || !existingUser.isVerified) {
			throw new AuthenticationError();
		}

		const isPasswordCorrect = await this._passwordHasherService.compare(
			input.password,
			existingUser.passwordHash,
		);

		if (!isPasswordCorrect) throw new AuthenticationError();

		const accessToken = this._tokenService.generateAccessToken({
			sub: existingUser.id,
			role: existingUser.role,
		});

		const refreshTokenId = randomUUID();

		const refreshToken = this._tokenService.generateRefreshToken({
			sub: existingUser.id,
			jti: refreshTokenId,
		});

		//TODO: fetch secure profile picture url and send it instead
		//
		const tempProfilePictureUrl: string = "https://picsum.photos/200";

		return LoginResponseMapper.toDto(
			existingUser,
			accessToken,
			refreshToken,
			tempProfilePictureUrl,
		);
	}
}

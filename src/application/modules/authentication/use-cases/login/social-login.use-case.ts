import { inject, injectable } from "inversify";
import type { User } from "../../../../../domain/entities/user.entity";
import { UserRegisteredEvent } from "../../../../../domain/events/user-registered.event";
import type { IUserRepository } from "../../../../../domain/repositories";
import { TYPES } from "../../../../../shared/types/types";
import type { EventBus } from "../../../../events/event-bus.interface";
import type {
	IOAuthIdentityProvider,
	ITokenService,
} from "../../../../services";
import type {
	OAuthProvider,
	SocialLoginInput,
	SocialLoginResponse,
} from "../../dtos";
import { AuthenticationError, UserBlockedError } from "../../errors";
import type { IAuthSessionService } from "../../services";
import type { ISocialLoginUseCase } from "./social-login.use-case.interface";

@injectable()
export class SocialLoginUseCase implements ISocialLoginUseCase {
	private readonly _providers: Map<OAuthProvider, IOAuthIdentityProvider>;

	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.GoogleOAuth)
		googleOAuthProvider: IOAuthIdentityProvider,
		@inject(TYPES.Services.LinkedInOAuth)
		linkedInOAuthProvider: IOAuthIdentityProvider,
		@inject(TYPES.Services.TokenService)
		private readonly _tokenService: ITokenService,
		@inject(TYPES.Services.AuthSession)
		private readonly _authSessionService: IAuthSessionService,
		@inject(TYPES.Services.EventBus)
		private readonly _eventBus: EventBus,
	) {
		this._providers = new Map([
			[googleOAuthProvider.provider, googleOAuthProvider],
			[linkedInOAuthProvider.provider, linkedInOAuthProvider],
		]);
	}

	async execute(input: SocialLoginInput): Promise<SocialLoginResponse> {
		const provider = this._providers.get(input.provider);

		if (!provider) {
			throw new AuthenticationError();
		}

		const identity = await provider.getIdentity(input.credential);
		const existingUserByProvider =
			input.provider === "GOOGLE"
				? await this._userRepository.findByGoogleId(identity.providerUserId)
				: await this._userRepository.findByLinkedinId(identity.providerUserId);

		if (existingUserByProvider?.isBlocked) {
			throw new UserBlockedError();
		}

		if (existingUserByProvider) {
			return this._authSessionService.createLoginResponse(
				existingUserByProvider,
				input,
			);
		}

		const existingUser = await this._userRepository.findByEmail(identity.email);

		if (
			existingUser &&
			existingUser.authType !== "LOCAL" &&
			existingUser.authType !== input.provider
		) {
			throw new AuthenticationError();
		}

		if (existingUser?.isBlocked) {
			throw new UserBlockedError();
		}

		if (existingUser) {
			if (existingUser.authType === "LOCAL" && !identity.isVerified) {
				throw new AuthenticationError();
			}

			const linkedUser = await this._userRepository.updateById(
				existingUser.id,
				{
					googleId:
						input.provider === "GOOGLE"
							? identity.providerUserId
							: existingUser.googleId,
					linkedinId:
						input.provider === "LINKEDIN"
							? identity.providerUserId
							: existingUser.linkedinId,
					isVerified: existingUser.isVerified || identity.isVerified,
				},
			);

			return this._authSessionService.createLoginResponse(
				linkedUser ?? existingUser,
				input,
			);
		}

		const user = await this._userRepository.create({
			name: identity.name,
			email: identity.email,
			googleId: input.provider === "GOOGLE" ? identity.providerUserId : null,
			linkedinId:
				input.provider === "LINKEDIN" ? identity.providerUserId : null,
			phone: "",
			coinBalance: 0,
			authType: input.provider,
			profilePictureId: null,
			role: "USER",
			isBlocked: false,
			isVerified: identity.isVerified,
		} as User);

		await this._eventBus.publish(
			new UserRegisteredEvent({ userId: user.id, email: user.email }),
		);

		const setupToken = await this._tokenService.generateSetupToken({
			sub: user.id,
		});

		return { setupToken };
	}
}

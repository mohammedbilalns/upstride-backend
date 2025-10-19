import {
	AuthService,
	CryptoService,
	OtpService,
	TokenService,
} from "../../../application/services";
import { CacheService } from "../../../application/services/cache.service";
import { PasswordResetService } from "../../../application/services/passwordReset.service";
import { RegistrationService } from "../../../application/services/registration.service";
import type { IEventBus } from "../../../domain/events/IEventBus";
import type { IUserRepository } from "../../../domain/repositories";
import type {
	ICryptoService,
	IOtpService,
	ITokenService,
} from "../../../domain/services";
import { redisClient } from "../../../infrastructure/config";
import env from "../../../infrastructure/config/env";
import { UserRepository } from "../../../infrastructure/database/repositories/user.repository";
import { VerificationTokenRepository } from "../../../infrastructure/database/repositories/verficationToken.repository";
import EventBus from "../../../infrastructure/events/eventBus";
import { AuthController } from "../controllers/auth.controller";

export function createAuthController(): AuthController {
	const userRepository: IUserRepository = new UserRepository();
	const verificationTokenRepository = new VerificationTokenRepository(
		redisClient,
	);
	const otpRepository = new VerificationTokenRepository(redisClient);
	const cryptoService: ICryptoService = new CryptoService();
	const tokenService: ITokenService = new TokenService(env.JWT_SECRET);
	const otpService: IOtpService = new OtpService();
	const eventBus: IEventBus = EventBus;
	const cacheService = new CacheService(redisClient);
	const registrationService = new RegistrationService(
		userRepository,
		cryptoService,
		otpRepository,
		tokenService,
		otpService,
		eventBus,
		cacheService,
	);
	const authService = new AuthService(
		userRepository,
		verificationTokenRepository,
		cryptoService,
		tokenService,
		cacheService,
	);
	const passwordResetService = new PasswordResetService(
		userRepository,
		otpRepository,
		cryptoService,
		otpService,
		eventBus,
	);
	return new AuthController(
		authService,
		registrationService,
		passwordResetService,
	);
}

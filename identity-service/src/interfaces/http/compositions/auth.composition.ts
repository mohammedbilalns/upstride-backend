import {
	AuthService,
	CryptoService,
	TokenService,
} from "../../../application/services";
import { CacheService } from "../../../application/services/cache.service";
import { PasswordResetService } from "../../../application/services/passwordReset.service";
import { RegistrationService } from "../../../application/services/registration.service";

import type { IEventBus } from "../../../domain/events/IEventBus";
import type { IUserRepository } from "../../../domain/repositories";
import type { ICryptoService, ITokenService } from "../../../domain/services";

import { redisClient } from "../../../infrastructure/config";
import env from "../../../infrastructure/config/env";

import { UserRepository } from "../../../infrastructure/database/repositories/user.repository";
import { VerificationTokenRepository } from "../../../infrastructure/database/repositories/verficationToken.repository";
import EventBus from "../../../infrastructure/events/eventBus";

import { AuthController } from "../controllers/auth.controller";

/**
 * Factory function to assemble the AuthController with DI
 */
export function createAuthController(): AuthController {
	// ─────────────────────────────────────────────
	// Repositories
	// ─────────────────────────────────────────────
	const userRepository: IUserRepository = new UserRepository();
	const verificationTokenRepository = new VerificationTokenRepository(
		redisClient,
	);
	const otpRepository = new VerificationTokenRepository(redisClient);

	// ─────────────────────────────────────────────
	// Services
	// ─────────────────────────────────────────────
	const cryptoService: ICryptoService = new CryptoService();
	const tokenService: ITokenService = new TokenService(env.JWT_SECRET);
	const cacheService = new CacheService(redisClient);

	// Event system
	const eventBus: IEventBus = EventBus;

	// ─────────────────────────────────────────────
	// Application Services
	// ─────────────────────────────────────────────
	const registrationService = new RegistrationService(
		userRepository,
		cryptoService,
		otpRepository,
		tokenService,
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
		eventBus,
	);

	// ─────────────────────────────────────────────
	// Controller
	// ─────────────────────────────────────────────
	return new AuthController(
		authService,
		registrationService,
		passwordResetService,
	);
}

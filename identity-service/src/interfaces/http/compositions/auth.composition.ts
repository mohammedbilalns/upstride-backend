import {
	AuthService,
	CryptoService,
	TokenService,
} from "../../../application/services";
import { CacheService } from "../../../application/services/cache.service";
import type { IUserRepository } from "../../../domain/repositories";
import type { ICryptoService, ITokenService } from "../../../domain/services";

import { redisClient } from "../../../infrastructure/config";
import env from "../../../infrastructure/config/env";

import { UserRepository } from "../../../infrastructure/database/repositories/user.repository";
import { VerificationTokenRepository } from "../../../infrastructure/database/repositories/verficationToken.repository";

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

	// ─────────────────────────────────────────────
	// Services
	// ─────────────────────────────────────────────
	const cryptoService: ICryptoService = new CryptoService();
	const tokenService: ITokenService = new TokenService(env.JWT_SECRET);
	const cacheService = new CacheService(redisClient);

	// ─────────────────────────────────────────────
	// Application Services
	// ─────────────────────────────────────────────

	const authService = new AuthService(
		userRepository,
		verificationTokenRepository,
		cryptoService,
		tokenService,
		cacheService,
	);

	// ─────────────────────────────────────────────
	// Controller
	// ─────────────────────────────────────────────
	return new AuthController(authService);
}

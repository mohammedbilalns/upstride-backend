import { CryptoService } from "../../../application/services";
import {
	InitiatePasswordResetUC,
	ResendResetOtpUC,
	UpdatePasswordUC,
	VerifyResetOtpUC,
} from "../../../application/usecases/resetUserPassword";
import { IUserRepository } from "../../../domain/repositories";
import { redisClient } from "../../../infrastructure/config";
import { UserRepository } from "../../../infrastructure/database/repositories";
import { VerificationTokenRepository } from "../../../infrastructure/database/repositories/verficationToken.repository";
import EventBus from "../../../infrastructure/events/eventBus";
import { PasswordResetController } from "../controllers/passwordReset.controller";

export function createPasswordResetController(): PasswordResetController {
	// repositories
	const userRepository: IUserRepository = new UserRepository();
	const verificationTokenRepository = new VerificationTokenRepository(
		redisClient,
	);
	// services
	const cryptoService = new CryptoService();
	// usecases

	const initiatePasswordResetUC = new InitiatePasswordResetUC(
		userRepository,
		verificationTokenRepository,
		EventBus,
	);
	const resendResetOtpUC = new ResendResetOtpUC(
		userRepository,
		verificationTokenRepository,
		EventBus,
	);
	const updatePasswordUC = new UpdatePasswordUC(
		userRepository,
		verificationTokenRepository,
		cryptoService,
	);
	const verifyResetOtpUC = new VerifyResetOtpUC(verificationTokenRepository);

	return new PasswordResetController(
		initiatePasswordResetUC,
		resendResetOtpUC,
		verifyResetOtpUC,
		updatePasswordUC,
	);
}

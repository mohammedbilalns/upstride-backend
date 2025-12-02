import { RegistrationController } from "../controllers/registration.controller";
import {
	IRegisterUserUC,
	IVerifyOtpUC,
	IResendRegisterOtpUC,
	ICreateInterestsUC,
} from "../../../domain/useCases/userRegistration";
import {
	ExpertiseRepository,
	SkillRepository,
	UserRepository,
} from "../../../infrastructure/database/repositories";
import {
	IExpertiseRepository,
	ISkillRepository,
	IUserRepository,
	IVerificationTokenRepository,
} from "../../../domain/repositories";
import {
	CreateInterestsUC,
	VerifyOtpUC,
	RegisterUserUC,
	ResendRegisterOtpUC,
} from "../../../application/usecases/userRegistration";
import { VerificationTokenRepository } from "../../../infrastructure/database/repositories/verficationToken.repository";
import { redisClient } from "../../../infrastructure/config";
import { CacheService } from "../../../application/services/cache.service";
import { ICacheService } from "../../../domain/services/cache.service.interface";
import { CryptoService, TokenService } from "../../../application/services";
import { ICryptoService, ITokenService } from "../../../domain/services";
import env from "../../../infrastructure/config/env";
import EventBus from "../../../infrastructure/events/eventBus";

export function createRegistrationController(): RegistrationController {
	// repositories
	const userRepository: IUserRepository = new UserRepository();
	const verificationTokenRepository: IVerificationTokenRepository =
		new VerificationTokenRepository(redisClient);
	const expertiseRepository: IExpertiseRepository = new ExpertiseRepository();
	const skillRepostiory: ISkillRepository = new SkillRepository();
	// services
	const cacheService: ICacheService = new CacheService(redisClient);
	const tokenService: ITokenService = new TokenService(env.JWT_SECRET);
	const cryptoService: ICryptoService = new CryptoService();

	// usecases
	const createInterestsUC: ICreateInterestsUC = new CreateInterestsUC(
		userRepository,
		verificationTokenRepository,
		expertiseRepository,
		skillRepostiory,
		cacheService,
		tokenService,
	);
	const registerUserUC: IRegisterUserUC = new RegisterUserUC(
		userRepository,
		verificationTokenRepository,
		cryptoService,
		EventBus,
	);

	const verifyOtpUC: IVerifyOtpUC = new VerifyOtpUC(
		userRepository,
		verificationTokenRepository,
	);
	const resendRegisterOtpUC: IResendRegisterOtpUC = new ResendRegisterOtpUC(
		userRepository,
		verificationTokenRepository,
		EventBus,
	);

	return new RegistrationController(
		registerUserUC,
		verifyOtpUC,
		resendRegisterOtpUC,
		createInterestsUC,
	);
}

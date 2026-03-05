import { Queue } from "bullmq";
import { Container } from "inversify";
import { GetMeUseCase } from "../application/authentication/use-cases/get-me.usecase";
import { LoginWithEmailUseCase } from "../application/authentication/use-cases/login/login-with-email.use-case";
import { GetActiveSessionsUseCase } from "../application/authentication/use-cases/logout/get-active-sessions.usecase";
import { LogoutUseCase } from "../application/authentication/use-cases/logout/logout.usecase";
import { RevokeAllOtherSessionsUseCase } from "../application/authentication/use-cases/logout/revoke-all-other-sessions.usecase";
import { RevokeSessionUseCase } from "../application/authentication/use-cases/logout/revoke-session.usecase";
import {
	ChangePasswordUseCase,
	RequestPasswordResetUseCase,
} from "../application/authentication/use-cases/password-reset";
import { RefreshSessionUseCase } from "../application/authentication/use-cases/refresh-session/refresh-session.usecase";
import { RegisterWithEmailUseCase } from "../application/authentication/use-cases/registration/register-with-email.usecase";
import { ResendOtpUseCase } from "../application/authentication/use-cases/resend-otp.usecase";
import { SaveUserInterestsUseCase } from "../application/authentication/use-cases/save-user-interests/save-user-interests.usecase";
import { VerifyOtpUseCase } from "../application/authentication/use-cases/verify-otp.usecase";
import { GetOnboardingCatalogUseCase } from "../application/catalog-management/use-cases/get-onboarding-catalog.usecase";
import type { IHasherService } from "../application/services";
import type { IMailService } from "../application/services/mail.service.interface";
import { GetUsersUseCase } from "../application/user-management/use-cases/get-users.usecase";
import {
	MongoInterestRepository,
	MongoSessionRepository,
	MongoSkillRepository,
	MongoUserRepository,
} from "../infrastructure/database/mongodb/repositories";
import { redisClient } from "../infrastructure/database/redis/redis.connection";
import { RedisOtpRepository } from "../infrastructure/database/redis/repositories/otp.repository";
import { RedisTokenRevocationRepository } from "../infrastructure/database/redis/repositories/token-revokation.repository";
import { Argon2HasherService } from "../infrastructure/services/argon2.service";
import { JwtTokenService } from "../infrastructure/services/jwt-token.service";
import { MailService } from "../infrastructure/services/mail.service";
import { CryptoOtpGenerator } from "../infrastructure/services/otp-generator.service";
import {
	AuthController,
	CatalogController,
	LogoutController,
	PasswordResetController,
	UserManagementController,
} from "../interfaces/http/controllers";
import { TYPES } from "../shared/types/types";

const container = new Container();

//-------------------------
// Queues
//-------------------------
export const mailQueue = new Queue("mailQueue", { connection: redisClient });
container.bind<Queue>(TYPES.Queues.MailQueue).toConstantValue(mailQueue);

//-------------------------
// Services
//-------------------------
container.bind<IHasherService>(TYPES.Services.Hasher).to(Argon2HasherService);
container.bind(TYPES.Services.TokenService).to(JwtTokenService);
container.bind<IMailService>(TYPES.Services.MailService).to(MailService);
container.bind(TYPES.Services.OtpGenerator).to(CryptoOtpGenerator);

//-------------------------
// Repositories
//-------------------------
container.bind(TYPES.Repositories.UserRepository).to(MongoUserRepository);
container.bind(TYPES.Repositories.OtpRepository).to(RedisOtpRepository);
container.bind(TYPES.Repositories.SessionRepository).to(MongoSessionRepository);
container
	.bind(TYPES.Repositories.TokenRevocationRepository)
	.to(RedisTokenRevocationRepository);
container
	.bind(TYPES.Repositories.InterestRepository)
	.to(MongoInterestRepository);
container.bind(TYPES.Repositories.SkillRepository).to(MongoSkillRepository);

//-------------------------
// Databases
//-------------------------
container.bind(TYPES.Databases.Redis).toConstantValue(redisClient);

//-------------------------
// Use Cases
//-------------------------

container.bind(TYPES.UseCases.LoginWithEmail).to(LoginWithEmailUseCase);
container.bind(TYPES.UseCases.RegisterWithEmail).to(RegisterWithEmailUseCase);
container
	.bind(TYPES.UseCases.RequestPasswordReset)
	.to(RequestPasswordResetUseCase);
container.bind(TYPES.UseCases.ChangePassword).to(ChangePasswordUseCase);
container.bind(TYPES.UseCases.VerifyOtp).to(VerifyOtpUseCase);
container.bind(TYPES.UseCases.ResendOtp).to(ResendOtpUseCase);
container.bind(TYPES.UseCases.RefreshSession).to(RefreshSessionUseCase);
container.bind(TYPES.UseCases.Logout).to(LogoutUseCase);
container.bind(TYPES.UseCases.RevokeSession).to(RevokeSessionUseCase);
container
	.bind(TYPES.UseCases.RevokeAllOtherSessions)
	.to(RevokeAllOtherSessionsUseCase);
container.bind(TYPES.UseCases.SaveUserInterests).to(SaveUserInterestsUseCase);
container.bind(TYPES.UseCases.GetMe).to(GetMeUseCase);
container.bind(TYPES.UseCases.GetActiveSessions).to(GetActiveSessionsUseCase);
container
	.bind(TYPES.UseCases.GetOnboardingCatalog)
	.to(GetOnboardingCatalogUseCase);
container.bind(TYPES.UseCases.GetUsers).to(GetUsersUseCase);

//-------------------------
// Controllers
//-------------------------
container.bind(AuthController).to(AuthController);
container.bind(PasswordResetController).to(PasswordResetController);
container.bind(LogoutController).to(LogoutController);
container.bind(CatalogController).to(CatalogController);
container.bind(UserManagementController).to(UserManagementController);
container.bind(TYPES.Controllers.UserManagement).to(UserManagementController);

export { container };

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
import { GetProfessionsUseCase } from "../application/catalog-management/use-cases/get-professions.usecase";
import { ApproveMentorUseCase } from "../application/mentor-management/use-cases/approve-mentor.usecase";
import type { IApproveMentorUseCase } from "../application/mentor-management/use-cases/approve-mentor.usecase.interface";
import { GetMentorApplicationsUseCase } from "../application/mentor-management/use-cases/get-mentor-applications.usecase";
import type { IGetMentorApplicationsUseCase } from "../application/mentor-management/use-cases/get-mentor-applications.usecase.interface";
import { GetMentorRegistrationInfoUseCase } from "../application/mentor-management/use-cases/get-mentor-registration-info.usecase";
import type { IGetMentorRegistrationInfoUseCase } from "../application/mentor-management/use-cases/get-mentor-registration-info.usecase.interface";
import { RegisterMentorUseCase } from "../application/mentor-management/use-cases/register-mentor.usecase";
import type { IRegisterMentorUseCase } from "../application/mentor-management/use-cases/register-mentor.usecase.interface";
import { RejectMentorUseCase } from "../application/mentor-management/use-cases/reject-mentor.usecase";
import type { IRejectMentorUseCase } from "../application/mentor-management/use-cases/reject-mentor.usecase.interface";
import { ResubmitMentorUseCase } from "../application/mentor-management/use-cases/resubmit-mentor.usecase";
import type { IResubmitMentorUseCase } from "../application/mentor-management/use-cases/resubmit-mentor.usecase.interface";
import { GetProfileUseCase } from "../application/profile-management/use-cases/get-profile.usecase";
import type { IGetProfileUseCase } from "../application/profile-management/use-cases/get-profile.usecase.interface";
import { UpdateProfileUseCase } from "../application/profile-management/use-cases/update-profile.usecase";
import type { IUpdateProfileUseCase } from "../application/profile-management/use-cases/update-profile.usecase.interface";
import type { IHasherService, IStorageService } from "../application/services";
import type { IMailService } from "../application/services/mail.service.interface";
import { DeleteFileUseCase } from "../application/storage-management/use-cases/delete-file.usecase";
import { GetPreSignedUploadUrlUseCase } from "../application/storage-management/use-cases/get-presigned-upload-url.usecase";
import { BlockUserUseCase } from "../application/user-management/use-cases/block-user.usecase";
import { GetUsersUseCase } from "../application/user-management/use-cases/get-users.usecase";
import { UnblockUserUseCase } from "../application/user-management/use-cases/unblock-user.usecase";
import type {
	IMentorRepository,
	IProfessionRepository,
} from "../domain/repositories";
import {
	MongoInterestRepository,
	MongoMentorRepository,
	MongoSessionRepository,
	MongoSkillRepository,
	MongoUserRepository,
} from "../infrastructure/database/mongodb/repositories";
import { MongoProfessionRepository } from "../infrastructure/database/mongodb/repositories/profession.repository";
import { redisClient } from "../infrastructure/database/redis/redis.connection";
import { RedisOtpRepository } from "../infrastructure/database/redis/repositories/otp.repository";
import { RedisTokenRevocationRepository } from "../infrastructure/database/redis/repositories/token-revokation.repository";
import { Argon2HasherService } from "../infrastructure/services/argon2.service";
import { JwtTokenService } from "../infrastructure/services/jwt-token.service";
import { MailService } from "../infrastructure/services/mail.service";
import { CryptoOtpGenerator } from "../infrastructure/services/otp-generator.service";
import { S3StorageService } from "../infrastructure/services/s3-storage.service";
import {
	AuthController,
	CatalogController,
	FileController,
	LogoutController,
	MentorController,
	PasswordResetController,
	ProfileController,
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
container.bind<IStorageService>(TYPES.Services.Storage).to(S3StorageService);

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
container
	.bind<IProfessionRepository>(TYPES.Repositories.ProfessionRepository)
	.to(MongoProfessionRepository)
	.inSingletonScope();
container
	.bind<IMentorRepository>(TYPES.Repositories.MentorRepository)
	.to(MongoMentorRepository)
	.inSingletonScope();

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
	.bind<GetOnboardingCatalogUseCase>(TYPES.UseCases.GetOnboardingCatalog)
	.to(GetOnboardingCatalogUseCase)
	.inSingletonScope();
container
	.bind<IGetProfileUseCase>(TYPES.UseCases.GetProfile)
	.to(GetProfileUseCase)
	.inSingletonScope();
container
	.bind<IUpdateProfileUseCase>(TYPES.UseCases.UpdateProfile)
	.to(UpdateProfileUseCase)
	.inSingletonScope();
container
	.bind<GetProfessionsUseCase>(TYPES.UseCases.GetProfessions)
	.to(GetProfessionsUseCase)
	.inSingletonScope();
container.bind(TYPES.UseCases.GetUsers).to(GetUsersUseCase);
container.bind(TYPES.UseCases.BlockUser).to(BlockUserUseCase);
container.bind(TYPES.UseCases.UnblockUser).to(UnblockUserUseCase);
container
	.bind(TYPES.UseCases.GetPreSignedUploadUrl)
	.to(GetPreSignedUploadUrlUseCase);
container.bind(TYPES.UseCases.DeleteFile).to(DeleteFileUseCase);
container
	.bind<IGetMentorRegistrationInfoUseCase>(
		TYPES.UseCases.GetMentorRegistrationInfo,
	)
	.to(GetMentorRegistrationInfoUseCase);
container
	.bind<IRegisterMentorUseCase>(TYPES.UseCases.RegisterMentor)
	.to(RegisterMentorUseCase);
container
	.bind<IResubmitMentorUseCase>(TYPES.UseCases.ResubmitMentor)
	.to(ResubmitMentorUseCase);
container
	.bind<IGetMentorApplicationsUseCase>(TYPES.UseCases.GetMentorApplications)
	.to(GetMentorApplicationsUseCase);
container
	.bind<IApproveMentorUseCase>(TYPES.UseCases.ApproveMentor)
	.to(ApproveMentorUseCase);
container
	.bind<IRejectMentorUseCase>(TYPES.UseCases.RejectMentor)
	.to(RejectMentorUseCase);

//-------------------------
// Controllers
//-------------------------
container.bind(AuthController).to(AuthController);
container.bind(PasswordResetController).to(PasswordResetController);
container.bind(LogoutController).to(LogoutController);
container.bind(CatalogController).to(CatalogController);
container.bind(UserManagementController).to(UserManagementController);
container.bind(TYPES.Controllers.UserManagement).to(UserManagementController);
container.bind(FileController).to(FileController);
container.bind(TYPES.Controllers.File).to(FileController);
container.bind(MentorController).to(MentorController);
container.bind(TYPES.Controllers.Mentor).to(MentorController);
container.bind(ProfileController).to(ProfileController);
container
	.bind<ProfileController>(TYPES.Controllers.Profile)
	.to(ProfileController);

export { container };

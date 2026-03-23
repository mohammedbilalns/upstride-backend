import { Queue } from "bullmq";
import type { Container } from "inversify";
import type { EventBus } from "../../application/events/event-bus.interface";
import type {
	IIdGenerator,
	IMailService,
	IPasswordService,
	IPaymentService,
	IPaymentWebhookParser,
	IPlatformSettingsCache,
	IStorageService,
	IWalletService,
	PlatformSettingsService,
} from "../../application/services";
import type {
	IMentorListRepository,
	IMentorRepository,
	INotificationRepository,
	IPlatformSettingsRepository,
	IProfessionRepository,
	ISavedMentorRepository,
} from "../../domain/repositories";
import {
	MongoCoinTransactionRepository,
	MongoInterestRepository,
	MongoMentorListRepository,
	MongoMentorRepository,
	MongoNotificationRepository,
	MongoPaymentTransactionRepository,
	MongoPlatformSettingsRepository,
	MongoPlatformWalletRepository,
	MongoSavedMentorRepository,
	MongoSessionAvailabilityRepository,
	MongoSessionBookingRepository,
	MongoSessionRepository,
	MongoSessionSlotRepository,
	MongoSkillRepository,
	MongoUserRepository,
} from "../../infrastructure/database/mongodb/repositories";
import { MongoProfessionRepository } from "../../infrastructure/database/mongodb/repositories/profession.repository";
import { redisClient } from "../../infrastructure/database/redis/redis.connection";
import { RedisPlatformSettingsCache } from "../../infrastructure/database/redis/redis-platform-settings.cache";
import { RedisOtpRepository } from "../../infrastructure/database/redis/repositories/otp.repository";
import { RedisTokenRevocationRepository } from "../../infrastructure/database/redis/repositories/token-revokation.repository";
import {
	Argon2PasswordService,
	CachedPlatformSettingsService,
	CryptoOtpGenerator,
	GoogleOAuthService,
	JwtTokenService,
	LinkedInOAuthService,
	MailService,
	NodeEventBus,
	S3StorageService,
	StripePaymentService,
	StripeWebhookParser,
	UuidGenerator,
	WalletService,
} from "../../infrastructure/services";
import { TYPES } from "../../shared/types/types";

export const mailQueue = new Queue("mailQueue", { connection: redisClient });

//FIX: common.di.ts` is doing too much.** It registers all repositories, all infrastructure services, Redis, queues — it's become a dumping ground. Split into `repositories.di.ts`, `infrastructure-services.di.ts`, `queues.di.ts`.
export const registerCommonBindings = (container: Container): void => {
	container.bind<Queue>(TYPES.Queues.MailQueue).toConstantValue(mailQueue);

	container
		.bind<IPasswordService>(TYPES.Services.Password)
		.to(Argon2PasswordService);
	container.bind(TYPES.Services.TokenService).to(JwtTokenService);
	container.bind<IMailService>(TYPES.Services.MailService).to(MailService);
	container.bind(TYPES.Services.OtpGenerator).to(CryptoOtpGenerator);
	container.bind(TYPES.Services.GoogleOAuth).to(GoogleOAuthService);
	container.bind(TYPES.Services.LinkedInOAuth).to(LinkedInOAuthService);
	container.bind<IStorageService>(TYPES.Services.Storage).to(S3StorageService);
	container
		.bind<IPlatformSettingsCache>(TYPES.Caches.PlatformSettings)
		.to(RedisPlatformSettingsCache)
		.inSingletonScope();
	container
		.bind<PlatformSettingsService>(TYPES.Services.PlatformSettings)
		.to(CachedPlatformSettingsService)
		.inSingletonScope();
	container
		.bind<IWalletService>(TYPES.Services.WalletService)
		.to(WalletService)
		.inSingletonScope();
	container
		.bind<IPaymentService>(TYPES.Services.PaymentService)
		.to(StripePaymentService)
		.inSingletonScope();
	container
		.bind<IPaymentWebhookParser>(TYPES.Services.PaymentWebhookParser)
		.to(StripeWebhookParser)
		.inSingletonScope();
	container
		.bind<IIdGenerator>(TYPES.Services.IdGenerator)
		.to(UuidGenerator)
		.inSingletonScope();

	container
		.bind<EventBus>(TYPES.Services.EventBus)
		.to(NodeEventBus)
		.inSingletonScope();

	container
		.bind(TYPES.Repositories.UserRepository)
		.to(MongoUserRepository)
		.inSingletonScope();
	container
		.bind(TYPES.Repositories.CoinTransactionRepository)
		.to(MongoCoinTransactionRepository)
		.inSingletonScope();
	container
		.bind(TYPES.Repositories.OtpRepository)
		.to(RedisOtpRepository)
		.inSingletonScope();
	container
		.bind(TYPES.Repositories.PaymentTransactionRepository)
		.to(MongoPaymentTransactionRepository)
		.inSingletonScope();
	container
		.bind(TYPES.Repositories.PlatformWalletRepository)
		.to(MongoPlatformWalletRepository)
		.inSingletonScope();
	container
		.bind(TYPES.Repositories.SessionRepository)
		.to(MongoSessionRepository)
		.inSingletonScope();
	container
		.bind(TYPES.Repositories.TokenRevocationRepository)
		.to(RedisTokenRevocationRepository)
		.inSingletonScope();
	container
		.bind<IPlatformSettingsRepository>(
			TYPES.Repositories.PlatformSettingsRepository,
		)
		.to(MongoPlatformSettingsRepository)
		.inSingletonScope();
	container
		.bind(TYPES.Repositories.InterestRepository)
		.to(MongoInterestRepository)
		.inSingletonScope();
	container
		.bind(TYPES.Repositories.SkillRepository)
		.to(MongoSkillRepository)
		.inSingletonScope();
	container
		.bind<IProfessionRepository>(TYPES.Repositories.ProfessionRepository)
		.to(MongoProfessionRepository)
		.inSingletonScope();
	container
		.bind<IMentorRepository>(TYPES.Repositories.MentorRepository)
		.to(MongoMentorRepository)
		.inSingletonScope();
	container
		.bind<IMentorListRepository>(TYPES.Repositories.MentorListRepository)
		.to(MongoMentorListRepository)
		.inSingletonScope();
	container
		.bind<INotificationRepository>(TYPES.Repositories.NotificationRepository)
		.to(MongoNotificationRepository)
		.inSingletonScope();
	container
		.bind<ISavedMentorRepository>(TYPES.Repositories.SavedMentorRepository)
		.to(MongoSavedMentorRepository)
		.inSingletonScope();
	container
		.bind(TYPES.Repositories.SessionAvailabilityRepository)
		.to(MongoSessionAvailabilityRepository)
		.inSingletonScope();
	container
		.bind(TYPES.Repositories.SessionSlotRepository)
		.to(MongoSessionSlotRepository)
		.inSingletonScope();
	container
		.bind(TYPES.Repositories.SessionBookingRepository)
		.to(MongoSessionBookingRepository)
		.inSingletonScope();

	container.bind(TYPES.Databases.Redis).toConstantValue(redisClient);
};

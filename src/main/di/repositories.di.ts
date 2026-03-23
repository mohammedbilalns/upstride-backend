import type { Container } from "inversify";
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
import { RedisOtpRepository } from "../../infrastructure/database/redis/repositories/otp.repository";
import { RedisTokenRevocationRepository } from "../../infrastructure/database/redis/repositories/token-revokation.repository";
import { TYPES } from "../../shared/types/types";

export const registerRepositoryBindings = (container: Container): void => {
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
};

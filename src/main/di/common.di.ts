import { Queue } from "bullmq";
import type { Container } from "inversify";
import type {
	IMailService,
	IPasswordService,
	IStorageService,
} from "../../application/services";
import type {
	IMentorRepository,
	IProfessionRepository,
} from "../../domain/repositories";
import {
	MongoInterestRepository,
	MongoMentorRepository,
	MongoSessionRepository,
	MongoSkillRepository,
	MongoUserRepository,
} from "../../infrastructure/database/mongodb/repositories";
import { MongoProfessionRepository } from "../../infrastructure/database/mongodb/repositories/profession.repository";
import { redisClient } from "../../infrastructure/database/redis/redis.connection";
import { RedisOtpRepository } from "../../infrastructure/database/redis/repositories/otp.repository";
import { RedisTokenRevocationRepository } from "../../infrastructure/database/redis/repositories/token-revokation.repository";
import {
	Argon2PasswordService,
	CryptoOtpGenerator,
	GoogleOAuthService,
	JwtTokenService,
	LinkedInOAuthService,
	MailService,
	S3StorageService,
} from "../../infrastructure/services";
import { TYPES } from "../../shared/types/types";

export const mailQueue = new Queue("mailQueue", { connection: redisClient });

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
		.bind(TYPES.Repositories.UserRepository)
		.to(MongoUserRepository)
		.inSingletonScope();
	container
		.bind(TYPES.Repositories.OtpRepository)
		.to(RedisOtpRepository)
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

	container.bind(TYPES.Databases.Redis).toConstantValue(redisClient);
};

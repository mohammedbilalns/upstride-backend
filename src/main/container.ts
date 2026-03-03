import { Queue } from "bullmq";
import { Container } from "inversify";
import { LoginWithEmailUseCase } from "../application/authentication/use-cases/login/login-with-email.use-case";
import { RequestPasswordResetUseCase } from "../application/authentication/use-cases/password-reset";
import { RegisterWithEmailUseCase } from "../application/authentication/use-cases/registration/register-with-email.usecase";
import type { IPasswordHasherService } from "../application/services";
import type { IMailService } from "../application/services/mail.service.interface";
import { MongoUserRepository } from "../infrastructure/database/mongodb/repositories";
import { redisClient } from "../infrastructure/database/redis/redis.connection";
import { RedisOtpRepository } from "../infrastructure/database/redis/repositories/otp.repository";
import { Argon2PasswordHasherService } from "../infrastructure/services/argon2.service";
import { JwtTokenService } from "../infrastructure/services/jwt-token.service";
import { MailService } from "../infrastructure/services/mail.service";
import { CryptoOtpGenerator } from "../infrastructure/services/otp-generator.service";
import { AuthController } from "../interfaces/http/controllers";
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
container
	.bind<IPasswordHasherService>(TYPES.Services.PasswordHasher)
	.to(Argon2PasswordHasherService);
container.bind(TYPES.Services.TokenService).to(JwtTokenService);
container.bind<IMailService>(TYPES.Services.MailService).to(MailService);
container.bind(TYPES.Services.OtpGenerator).to(CryptoOtpGenerator);

//-------------------------
// Repositories
//-------------------------
container.bind(TYPES.Repositories.UserRepository).to(MongoUserRepository);
container.bind(TYPES.Repositories.OtpRepository).to(RedisOtpRepository);

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

//-------------------------
// Controllers
//-------------------------
container.bind(AuthController).to(AuthController);

export { container };

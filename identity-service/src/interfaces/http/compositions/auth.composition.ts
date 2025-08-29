import {
  AuthService,
  CryptoService,
  TokenService,
  OtpService,
} from "../../../application/services";
import {
  ICryptoService,
  ITokenService,
  IOtpService,
} from "../../../domain/services";
import { IUserRepository } from "../../../domain/repositories";
import { UserRepository } from "../../../infrastructure/database/repositories/user.repository";
import { OtpRepository } from "../../../infrastructure/database/repositories/otp.repository";
import { AuthController } from "../controllers/auth.controller";
import { IEventBus } from "../../../domain/events/IEventBus";
import EventBus from "../../../infrastructure/events/eventBus";
import env from "../../../infrastructure/config/env";
import { redisClient } from "../../../infrastructure/config";

export function createAuthController(): AuthController {
  const userRepository: IUserRepository = new UserRepository();
  const otpRepository = new OtpRepository(redisClient);
  const cryptoService: ICryptoService = new CryptoService();
  const tokenService: ITokenService = new TokenService(env.JWT_SECRET);
  const otpService: IOtpService = new OtpService();
  const eventBus: IEventBus = EventBus;
  const authService = new AuthService(
    userRepository,
    otpRepository,
    cryptoService,
    tokenService,
    otpService,
    eventBus,
  );
  return new AuthController(authService);
}

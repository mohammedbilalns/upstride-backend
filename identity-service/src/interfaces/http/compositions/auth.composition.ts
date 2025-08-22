
import { AuthService, CryptoService, TokenService, OtpService} from "../../../application/services";
import { ICryptoService, ITokenService, IOtpService, ICacheService } from "../../../domain/services";
import { IUserRepository } from "../../../domain/repositories";
import { UserRepository } from "../../../infrastructure/database/repositories/user.repository";
import { AuthController } from "../controllers/auth.controller";
import { IEventBus } from "../../../domain/events/IEventBus";
import EventBus from "../../../infrastructure/events/eventBus";
import env from "../../../infrastructure/config/env";
import { getCacheService } from "../../../infrastructure/config/connectRedis";


export function createAuthController(): AuthController {

  const userRepository: IUserRepository = new UserRepository();
  const cryptoService: ICryptoService = new CryptoService();
  const tokenService: ITokenService = new TokenService(env.JWT_SECRET)
  const otpService: IOtpService = new OtpService()
  const cacheService: ICacheService =  getCacheService()
  const eventBus: IEventBus = EventBus;

  const authService = new AuthService(userRepository, cryptoService, tokenService, otpService, cacheService, eventBus);
  return new AuthController(authService);
}

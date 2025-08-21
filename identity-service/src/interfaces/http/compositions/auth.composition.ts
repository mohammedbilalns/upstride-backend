import { AuthService } from "../../../application/services/auth.service";
import { CryptoService } from "../../../application/services/crypto.service";
import { TokenService } from "../../../application/services/token.service";
import { IUserRepository } from "../../../domain/repositories";
import { ICryptoService, ITokenService } from "../../../domain/services";
import { UserRepository } from "../../../infrastructure/database/repositories/user.repository";
import { AuthController } from "../controllers/auth.controller";
import env from "../../../infrastructure/config/env";

export function createAuthController(): AuthController {

  const userRepository: IUserRepository = new UserRepository();
  const cryptoService : ICryptoService = new CryptoService();
  const tokenService: ITokenService = new TokenService(env.JWT_SECRET)

  const authService = new AuthService(userRepository, cryptoService, tokenService);
  return new AuthController(authService);
}
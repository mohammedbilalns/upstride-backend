import { Container } from "inversify";
import { LoginWithEmailUseCase } from "../application/authentication/use-cases/login/login-with-email.use-case";
import type { IPasswordHasherService } from "../application/services";
import { MongoUserRepository } from "../infrastructure/database/mongodb/repositories";
import { Argon2PasswordHasherService } from "../infrastructure/services/argon2.service";
import { JwtTokenService } from "../infrastructure/services/jwt-token.service";
import { AuthController } from "../interfaces/http/controllers";
import { TYPES } from "../shared/types/types";

const container = new Container();

//-------------------------
// Services
//-------------------------
container
	.bind<IPasswordHasherService>(TYPES.Services.PasswordHasher)
	.to(Argon2PasswordHasherService);
container.bind(TYPES.Services.TokenService).to(JwtTokenService);

//-------------------------
// Repositories
//-------------------------
container.bind(TYPES.Repositories.UserRepository).to(MongoUserRepository);

//-------------------------
// Use Cases
//-------------------------

container.bind(TYPES.UseCases.LoginWithEmail).to(LoginWithEmailUseCase);

//-------------------------
// Controllers
//-------------------------
container.bind(AuthController).to(AuthController);

export { container };

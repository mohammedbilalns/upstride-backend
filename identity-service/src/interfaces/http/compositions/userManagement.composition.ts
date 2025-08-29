import { UserRepository } from "../../../infrastructure/database/repositories/user.repository";
import { IUserRepository } from "../../../domain/repositories";
import { IUserManagementService } from "../../../domain/services/userManagement.service.interface";
import { UserManagementService } from "../../../application/services/userManagement.service";
import { UserManagementController } from "../controllers/userManagement.controller";
import { IRevokedUserRepository } from "../../../domain/repositories/revokeduser.repository.interface";
import { RevokedUserRepository } from "../../../infrastructure/database/repositories/revokeduser.repository";
import { redisClient } from "../../../infrastructure/config";

export function createUserManagementController() {
  const userRepository: IUserRepository = new UserRepository();
  const revokedUserRepository: IRevokedUserRepository =
    new RevokedUserRepository(redisClient);
  const userManagementService: IUserManagementService =
    new UserManagementService(userRepository, revokedUserRepository);
  return new UserManagementController(userManagementService);
}

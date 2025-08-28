import { UserRepository } from "../../../infrastructure/database/repositories/user.repository";
import { IUserRepository } from "../../../domain/repositories";
import { IUserManagementService } from "../../../domain/services/userManagement.service.interface";
import { UserManagementService } from "../../../application/services/userManagement.service";
import { UserManagementController } from "../controllers/userManagement.controller";

export function createUserManagementController() {
  const userRepository: IUserRepository = new UserRepository();
  const userManagementService: IUserManagementService =
    new UserManagementService(userRepository);
  return new UserManagementController(userManagementService);
}

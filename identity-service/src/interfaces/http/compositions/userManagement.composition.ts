import { UserManagementService } from "../../../application/services/userManagement.service";
import type { IUserRepository } from "../../../domain/repositories";
import type { IRevokedUserRepository } from "../../../domain/repositories/revokeduser.repository.interface";
import type { IUserManagementService } from "../../../domain/services/userManagement.service.interface";
import { redisClient } from "../../../infrastructure/config";
import { RevokedUserRepository } from "../../../infrastructure/database/repositories/revokeduser.repository";
import { UserRepository } from "../../../infrastructure/database/repositories/user.repository";
import { UserManagementController } from "../controllers/userManagement.controller";

export function createUserManagementController() {
	const userRepository: IUserRepository = new UserRepository();
	const revokedUserRepository: IRevokedUserRepository =
		new RevokedUserRepository(redisClient);
	const userManagementService: IUserManagementService =
		new UserManagementService(userRepository, revokedUserRepository);
	return new UserManagementController(userManagementService);
}

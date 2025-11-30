import {
	BlockUserUC,
	FetchUsersByIdsUC,
	FetchUsersUC,
	UnblockUserUC,
} from "../../../application/usecases/userManagement";
import type { IUserRepository } from "../../../domain/repositories";
import type { IRevokedUserRepository } from "../../../domain/repositories/revokeduser.repository.interface";
import {
	IBlockUserUC,
	IFetchUsersByIdsUC,
	IFetchUsersUC,
	IUnblockUserUC,
} from "../../../domain/useCases/userManagement";
import { redisClient } from "../../../infrastructure/config";
import { RevokedUserRepository } from "../../../infrastructure/database/repositories/revokeduser.repository";
import { UserRepository } from "../../../infrastructure/database/repositories/user.repository";
import { UserManagementController } from "../controllers/userManagement.controller";

export function createUserManagementController() {
	// repositories
	const userRepository: IUserRepository = new UserRepository();
	const revokedUserRepository: IRevokedUserRepository =
		new RevokedUserRepository(redisClient);
	// useCases
	const blockUserUC: IBlockUserUC = new BlockUserUC(
		userRepository,
		revokedUserRepository,
	);
	const unblockUserUC: IUnblockUserUC = new UnblockUserUC(
		userRepository,
		revokedUserRepository,
	);
	const fetchUsersUC: IFetchUsersUC = new FetchUsersUC(userRepository);
	const fetchUsersByIdsUC: IFetchUsersByIdsUC = new FetchUsersByIdsUC(
		userRepository,
	);

	return new UserManagementController(
		blockUserUC,
		unblockUserUC,
		fetchUsersUC,
		fetchUsersByIdsUC,
	);
}

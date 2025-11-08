import type { AdminUserDTO } from "../../application/dtos/user.dto";
import { User } from "../entities";

export interface IUserManagementService {
	fetchUsers(
		userRole: string,
		page: number,
		limit: number,
		query?: string,
	): Promise<{ users: AdminUserDTO[]; total: number }>;
	blockUser(id: string): Promise<void>;
	unblockUser(id: string): Promise<void>;
	fetchUsersByIds(ids: string[]): Promise<User[]>;
}

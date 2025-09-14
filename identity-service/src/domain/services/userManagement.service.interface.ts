import { AdminUserDTO } from "../../application/dtos/user.dto";

export interface IUserManagementService {
  fetchUsers(
    userRole: string,
    page: number,
    limit: number,
    query?: string,
  ): Promise<{ users: AdminUserDTO[]; total: number }>;
  blockUser(id: string): Promise<void>;
  unblockUser(id: string): Promise<void>;
	fetchUsersByIds(ids : string[]): Promise<AdminUserDTO[]>;
}

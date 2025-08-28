import { UserDTO } from "../../application/dtos/userDto";

export interface IUserManagementService {
  fetchUsers(page: number, limit: number, query?: string): Promise<UserDTO[]>;
  blockUser(id: string): Promise<void>;
  unblockUser(id: string): Promise<void>;
}

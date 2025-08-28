import { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { IUserManagementService } from "../../domain/services/userManagement.service.interface";
import { UserDTO } from "../dtos/userDto";

export class UserManagementService implements IUserManagementService {
  constructor(private _userRepository: IUserRepository) {}

  async fetchUsers(
    page: number,
    limit: number,
    query?: string,
  ): Promise<UserDTO[]> {
    return this._userRepository.findAll(page, limit, query);
  }

  async blockUser(id: string): Promise<void> {
    this._userRepository.update(id, { isBlocked: true });
  }

  async unblockUser(id: string): Promise<void> {
    this._userRepository.update(id, { isBlocked: false });
  }
}

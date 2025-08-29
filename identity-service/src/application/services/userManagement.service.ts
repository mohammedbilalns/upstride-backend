import { IRevokedUserRepository } from "../../domain/repositories/revokeduser.repository.interface";
import { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { IUserManagementService } from "../../domain/services/userManagement.service.interface";
import { AdminUserDTO } from "../dtos/userDto";

export class UserManagementService implements IUserManagementService {
  constructor(
    private _userRepository: IUserRepository,
    private _revokedUserRepository: IRevokedUserRepository,
  ) {}

  async fetchUsers(
    userRole: string,
    page: number,
    limit: number,
    query?: string,
  ): Promise<{ users: AdminUserDTO[]; total: number }> {
    let allowedRoles: string[] = [];

    if (userRole === "admin") {
      allowedRoles = ["user", "mentor"];
    } else if (userRole === "superadmin") {
      allowedRoles = ["user", "mentor", "admin"];
    } else {
      throw new Error("Unauthorized to fetch users");
    }

    const [users, total] = await Promise.all([
      this._userRepository.findAll(page, limit, allowedRoles, query),
      this._userRepository.count(allowedRoles),
    ]);

    const safeUsers: AdminUserDTO[] = users.map(
      ({ id, name, email, role, isBlocked, createdAt }) => ({
        id,
        name,
        email,
        isBlocked,
        role,
        createdAt,
      }),
    );

    return { users: safeUsers, total };
  }

  async blockUser(id: string): Promise<void> {
    this._userRepository.update(id, { isBlocked: true });
    this._revokedUserRepository.add(id);
  }

  async unblockUser(id: string): Promise<void> {
    this._userRepository.update(id, { isBlocked: false });
    const isRevoked = await this._revokedUserRepository.isRevoked(id);
    if (isRevoked) {
      this._revokedUserRepository.remove(id);
    }
  }
}

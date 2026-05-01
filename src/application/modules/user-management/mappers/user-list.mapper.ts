import type { User } from "../../../../domain/entities/user.entity";
import type { UserListDTO } from "../dtos/get-users.dto";

export class UserListMapper {
	static toDTO(user: User): UserListDTO {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			coinBalance: user.coinBalance,
			joinedAt: user.createdAt || new Date(),
			status: user.isBlocked ? "blocked" : "active",
		};
	}

	static toDTOs(users: User[]): UserListDTO[] {
		return users.map((user) => UserListMapper.toDTO(user));
	}
}

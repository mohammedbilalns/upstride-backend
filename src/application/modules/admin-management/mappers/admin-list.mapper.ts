import type { User } from "../../../../domain/entities/user.entity";
import type { AdminListDTO } from "../dtos";

export class AdminListMapper {
	static toDTO(user: User): AdminListDTO {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			addedAt: user.createdAt || new Date(),
			status: user.isBlocked ? "blocked" : "active",
		};
	}

	static toDTOs(users: User[]): AdminListDTO[] {
		return users.map((user) => AdminListMapper.toDTO(user));
	}
}

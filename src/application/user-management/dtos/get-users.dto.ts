import type { UserRole } from "../../../domain/entities/user.entity";

export interface GetUsersInput {
	page: number;
	limit: number;
	search?: string;
	role?: UserRole;
	status?: "active" | "blocked";
	sort?: "recent" | "old";
}

export interface UserListDTO {
	id: string;
	name: string;
	email: string;
	joinedAt: Date;
	status: "active" | "blocked";
	profilePictureUrl: string | null;
}

export interface GetUsersResponse {
	users: UserListDTO[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

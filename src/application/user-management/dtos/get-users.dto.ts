import type { UserRole } from "../../../domain/entities/user.entity";

export interface GetUsersInput {
	page: number;
	limit: number;
	search?: string;
	role?: UserRole | UserRole[];
	status?: "active" | "blocked";
	sort?: "recent" | "old";
}

export interface UserListDTO {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	coinBalance: number;
	joinedAt: Date;
	status: "active" | "blocked";
}

export interface GetUsersResponse {
	users: UserListDTO[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

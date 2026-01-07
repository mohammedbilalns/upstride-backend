import type { User } from "../../domain/entities";

export interface UserDTO {
	id: string;
	name: string;
	email: string;
	role: "user" | "mentor" | "admin" | "superadmin";
	profilePicture?: string;
	mentorId?: string;
}

export interface AdminUserDTO extends UserDTO {
	isBlocked: boolean;
	createdAt: Date;
}

export interface PopulatedUser
	extends Omit<User, "interestedExpertises" | "interestedSkills"> {
	interestedExpertises: Array<{ _id: string; name: string }>;
	interestedSkills: Array<{ _id: string; name: string }>;
}

export interface BlockUserDto {
	userId: string;
}

export interface UnblockUserDto {
	userId: string;
}

export interface FetchUsersDto {
	userRole: string;
	page: number;
	limit: number;
	query?: string;
}

export interface FetchUsersByIdsDto {
	userIds: string[];
}

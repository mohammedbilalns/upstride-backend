import { User } from "../../domain/entities";

export interface UserDTO {
	id: string;
	name: string;
	email: string;
	role: "user" | "mentor" | "admin" | "superadmin";
	profilePicture?: string;
}

export interface AdminUserDTO extends UserDTO {
	isBlocked: boolean;
	createdAt: Date;
}

export interface PopulatedUser extends Omit<User, 'interestedExpertises' | 'interestedSkills'> {
	interestedExpertises: Array<{ _id: string; name: string }>;
	interestedSkills: Array<{ _id: string; name: string }>;
}

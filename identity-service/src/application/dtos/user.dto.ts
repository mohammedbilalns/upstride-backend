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

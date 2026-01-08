export interface userData {
	id: string;
	name: string;
	email: string;
	profilePicture?: string;
	role: "user" | "mentor" | "admin" | "superadmin";
}

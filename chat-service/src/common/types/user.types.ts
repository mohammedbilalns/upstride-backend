export type userData = {
	id: string;
	name: string;
	profilePicture: string;
	role: "user" | "mentor" | "admin" | "superadmin";
	mentorId?: string;
};

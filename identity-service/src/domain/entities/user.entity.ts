export interface User {
	id: string;
	name: string;
	email: string;
	phone: string;
	profilePicture?: string;
	profilePictureId?: string;
	isBlocked: boolean;
	googleId?: string;
	passwordHash?: string;
	isVerified: boolean;
	isRequestedForMentoring?: "pending" | "approved" | "rejected";
	mentorRejectionReason?: string;
	mentorRegistrationCount: number;
	role: "user" | "mentor" | "admin" | "superadmin";
	interestedExpertises: string[];
	interestedSkills: string[];
	createdAt: Date;
	updatedAt?: Date;
}

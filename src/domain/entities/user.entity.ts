export const AuthTypeValues = ["LOCAL", "GOOGLE", "LINKEDIN"] as const;
export type AuthType = (typeof AuthTypeValues)[number];

export const UserRoleValues = [
	"USER",
	"MENTOR",
	"ADMIN",
	"SUPER_ADMIN",
] as const;
export type UserRole = (typeof UserRoleValues)[number];

export class User {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly email: string,
		public readonly phone: string,
		public readonly password: string,
		public readonly authType: AuthType,
		public readonly profilePictureId: string | null,
		public readonly role: UserRole,
		public readonly isBlocked: boolean,
		public readonly isVerified: boolean,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
	) {}
}

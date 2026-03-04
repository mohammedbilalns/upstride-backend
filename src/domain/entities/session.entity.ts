export class Session {
	constructor(
		public readonly id: string,
		public readonly userId: string,
		public readonly refreshTokenHash: string,
		public readonly expiresAt: Date,
		public readonly ipAddress: string,
		public readonly userAgent: string,
		public readonly deviceName: string,
		public readonly deviceType: string,
		public readonly revoked: boolean,
		public readonly lastUsedAt: Date,
		public readonly createdAt?: Date,
	) {}
}

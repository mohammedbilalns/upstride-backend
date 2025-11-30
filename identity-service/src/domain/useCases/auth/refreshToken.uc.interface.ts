export interface IRefreshTokenUC {
	execute(
		refreshToken: string,
	): Promise<{ accessToken: string; refreshToken: string }>;
}

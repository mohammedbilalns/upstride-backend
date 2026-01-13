import { RefreshTokenDto } from "../../../application/dtos/auth.dto";

export interface IRefreshTokenUC {
	execute(
		dto: RefreshTokenDto,
	): Promise<{ accessToken: string; refreshToken: string }>;
}

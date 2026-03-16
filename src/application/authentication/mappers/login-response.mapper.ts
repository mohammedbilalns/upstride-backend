import type { User } from "../../../domain/entities/user.entity";
import type { LoginResponse } from "../dtos";

export class LoginResponseMapper {
	static toDto(
		user: User,
		accessToken: string,
		refreshToken: string,
		profilePictureUrl: string | null,
	): LoginResponse {
		return {
			user: {
				id: user.id,
				name: user.name,
				role: user.role,
				coinBalance: user.coinBalance,
				profilePictureUrl: profilePictureUrl,
				isLocalAuth: user.authType === "LOCAL",
			},
			accessToken,
			refreshToken,
		};
	}
}

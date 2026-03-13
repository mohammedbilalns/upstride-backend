import type { User } from "../../../domain/entities/user.entity";
import type { GetMeOutput } from "../dtos/get-me.dto";

export class GetMeResponseMapper {
	static toDto(user: User, profilePictureUrl: string | null): GetMeOutput {
		return {
			user: {
				id: user.id,
				name: user.name,
				role: user.role,
				profilePictureUrl: profilePictureUrl,
				isLocalAuth: user.authType === "LOCAL",
			},
		};
	}
}

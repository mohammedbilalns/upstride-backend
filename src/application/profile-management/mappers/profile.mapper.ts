import type { UserProfileDTO } from "../dtos/get-profile.dto";

export class ProfileMapper {
	static toDTO(user: any, profilePictureUrl: string | null): UserProfileDTO {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			role: user.role,
			profilePictureUrl,
			preferences: user.preferences
				? {
						interests: (user.preferences.interests || []).map((i: any) => ({
							id: i._id?.toString() || i.id?.toString(),
							name: i.name,
						})),
						skills: (user.preferences.skills || []).map((s: any) => ({
							skillId: s.skillId?._id?.toString() || s.skillId?.id?.toString(),
							name: s.skillId?.name || "Unknown",
							interestId: s.skillId?.interestId?.toString(),
							level: s.level,
						})),
					}
				: undefined,
		};
	}
}

import type {
	PopulatedInterest,
	PopulatedSkill,
	UserWithPopulatedPreferences,
} from "../../../../domain/entities/user-preferences.entity";
import type { UserProfileDTO } from "../dtos/get-profile.dto";

export class ProfileMapper {
	static toDTO(
		user: UserWithPopulatedPreferences,
		profilePictureUrl: string | null,
	): UserProfileDTO {
		const interests = (user.preferences?.interests || []).map(
			(i: PopulatedInterest) => ({
				id: (i._id || i.id)?.toString() || "",
				name: i.name,
				skills: [] as { skillId: string; name: string }[],
			}),
		);

		const skills = (user.preferences?.skills || []).map(
			(s: PopulatedSkill) => ({
				skillId: (s.skillId._id || s.skillId.id)?.toString() || "",
				name: s.skillId.name || "Unknown",
				interestId: s.skillId.interestId.toString(),
			}),
		);

		// Group skills under each interest
		for (const skill of skills) {
			const interest = interests.find((i) => i.id === skill.interestId);
			if (interest) {
				interest.skills.push({
					skillId: skill.skillId,
					name: skill.name,
				});
			}
		}

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			coinBalance: user.coinBalance,
			role: user.role,
			authType: user.authType,
			profilePictureUrl,
			preferences: user.preferences
				? {
						interests: interests,
					}
				: undefined,
		};
	}
}

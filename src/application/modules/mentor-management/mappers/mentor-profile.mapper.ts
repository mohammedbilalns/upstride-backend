import type { MentorProfileDetails } from "../../../../domain/repositories/mentor.repository.interface";
import type { MentorProfileDto } from "../dtos/get-mentor-profile.dto";

export class MentorProfileMapper {
	static toDto(
		profile: MentorProfileDetails,
		mentorSessionEarningPercentage: number,
	): MentorProfileDto {
		return {
			id: profile.id,
			user: {
				id: profile.userId,
				name: profile.user.name,
				email: profile.user.email,
			},
			bio: profile.bio,
			organization: profile.organization,
			currentRole: profile.currentRoleDetails,
			personalWebsite: profile.personalWebsite,
			educationalQualifications: profile.educationalQualifications,
			expertises: profile.expertisesDetails,
			skills: profile.skillsDetails.map((skill) => ({
				id: skill.skillId.id,
				name: skill.skillId.name,
				level: skill.level,
			})),
			tierName: profile.tierName,
			tierMax30minPayment: profile.tierMax30minPayment,
			currentPricePer30Min: profile.currentPricePer30Min,
			mentorSessionEarningPercentage,
		};
	}
}

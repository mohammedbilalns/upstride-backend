import type { MentorProfileDetails } from "../../../../domain/repositories/mentor.repository.types";
import type { PublicMentorProfileDto } from "../dtos/get-public-mentor-profile.dto";

export class MentorPublicProfileMapper {
	static toDto(
		profile: MentorProfileDetails,
		avatar?: string,
	): PublicMentorProfileDto {
		return {
			id: profile.id,
			user: {
				id: profile.userId,
				name: profile.user.name,
				...(avatar ? { avatar } : {}),
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
			yearsOfExperience: profile.yearsOfExperience,
			avgRating: profile.avgRating,
		};
	}
}

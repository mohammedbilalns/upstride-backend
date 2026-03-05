import type { Mentor } from "../../../domain/entities/mentor.entity";
import type { MentorRegistrationInfoOutput } from "../dtos/get-mentor-registration-info.dto";

export class MentorRegistrationResponseMapper {
	static toDto(
		mentor: Mentor | null,
		canApply: boolean,
		attemptsCount: number,
		maxAttempts: number,
	): MentorRegistrationInfoOutput {
		return {
			canApply,
			attemptsCount,
			maxAttempts,
			existingProfile: mentor
				? {
						id: mentor.id,
						userId: mentor.userId,
						bio: mentor.bio,
						currentRoleId: mentor.currentRoleId,
						organization: mentor.organization,
						yearsOfExperience: mentor.yearsOfExperience,
						personalWebsite: mentor.personalWebsite,
						resumeId: mentor.resumeId,
						educationalQualifications: mentor.educationalQualifications,
						areasOfExpertise: mentor.areasOfExpertise,
						toolsAndSkills: mentor.toolsAndSkills.map((ts) => ({
							skillId: ts.skillId,
							level: ts.level,
						})),
						experience: mentor.experience.map((exp) => ({
							company: exp.company,
							role: exp.role,
							description: exp.description,
							from: exp.from,
							to: exp.to,
						})),
						isApproved: mentor.isApproved,
						isRejected: mentor.isRejected,
						applicationAttempts: mentor.applicationAttempts,
						updatedAt: mentor.updatedAt,
						rejectionReason: mentor.rejectionReason,
					}
				: null,
			rejectionReason: mentor?.rejectionReason ?? null,
		};
	}
}

import type { MentorApplicationDetails } from "../../../domain/repositories/mentor.repository.interface";
import type { MentorApplicationDTO } from "../dtos/get-mentor-applications.dto";

export class MentorApplicationMapper {
	static toDTO(
		item: MentorApplicationDetails,
		resumeUrl: string,
	): MentorApplicationDTO {
		let status: "approved" | "rejected" | "pending" = "pending";
		if (item.isApproved) status = "approved";
		else if (item.isRejected) status = "rejected";

		const expertises = (item.expertisesDetails || []).map((exp) => {
			const skills = (item.skillsDetails || [])
				.filter((sd) => {
					const skillInterestId = sd.skillId?.interestId?.toString();
					const expId = exp.id?.toString();
					return skillInterestId && expId && skillInterestId === expId;
				})
				.map((sd) => ({
					name: sd.skillId?.name || "Unknown",
					level: sd.level,
				}));

			return {
				name: exp.name,
				skills,
			};
		});

		return {
			id: item.id,
			userId: item.userId,
			name: item.user.name,
			email: item.user.email,
			organization: item.organization,
			yearsOfExperience: item.yearsOfExperience,
			currentRole: item.currentRoleDetails.name,
			bio: item.bio,
			personalWebsite: item.personalWebsite,
			expertises,
			resumeUrl,
			resubmissionCount: item.applicationAttempts,
			status,
			appliedAt: item.createdAt,
			updatedAt: item.updatedAt,
		};
	}
}

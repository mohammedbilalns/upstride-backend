import type { MentorApplicationDetails } from "../../../domain/repositories/mentor.repository.interface";
import type { MentorApplicationDTO } from "../dtos/get-mentor-applications.dto";

export class MentorApplicationMapper {
	static toDTOs(items: MentorApplicationDetails[]): MentorApplicationDTO[] {
		return items.map((item) => MentorApplicationMapper.toDTO(item));
	}

	static toDTO(item: MentorApplicationDetails): MentorApplicationDTO {
		let status: "approved" | "rejected" | "pending" = "pending";
		if (item.isApproved) status = "approved";
		else if (item.isRejected) status = "rejected";

		return {
			id: item.id,
			userId: item.userId,
			name: item.user.name,
			email: item.user.email,
			organization: item.organization,
			yearsOfExperience: item.yearsOfExperience,
			currentRole: item.currentRoleDetails.name,
			expertises: item.expertisesDetails.map((e) => e.name),
			skills: item.skillsDetails.map((s) => ({
				name: s.skillId.name,
				level: s.level,
			})),
			status,
			appliedAt: item.createdAt,
			updatedAt: item.updatedAt,
		};
	}
}

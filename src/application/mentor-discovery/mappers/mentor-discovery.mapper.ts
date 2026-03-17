import type { MentorDiscoveryDetails } from "../../../domain/repositories/mentor.repository.interface";
import type { MentorDiscoveryDto } from "../dtos/get-mentors.dto";

export class MentorDiscoveryMapper {
	static toDto(entity: MentorDiscoveryDetails): MentorDiscoveryDto {
		return {
			id: entity.id,
			userId: entity.userId,
			name: entity.user.name,
			avatar: entity.user.profilePictureId,
			designation: entity.currentRoleDetails?.name,
			bio: entity.bio,
			yearsOfExperience: entity.yearsOfExperience,
			avgRating: entity.avgRating,
			tierId: entity.tierId,
			categoryIds: entity.areasOfExpertise,
			categories: entity.categories,
			createdAt: entity.createdAt,
		};
	}

	static toDtos(entities: MentorDiscoveryDetails[]): MentorDiscoveryDto[] {
		return entities.map((entity) => MentorDiscoveryMapper.toDto(entity));
	}
}

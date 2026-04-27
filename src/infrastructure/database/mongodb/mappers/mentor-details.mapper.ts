import type {
	MentorDiscoveryDetails,
	MentorProfileDetails,
} from "../../../../domain/repositories/mentor.repository.types";
import type { MentorDocument } from "../models/mentor.model";
import { toIdString } from "../utils/id.util";
import { MentorMapper } from "./mentor.mapper";

type IdLike = { toString?: () => string } | string | null | undefined;

const resolveId = (...candidates: IdLike[]): string => {
	for (const candidate of candidates) {
		const id = toIdString(candidate);
		if (id) return id;
	}
	return "";
};

const buildCategories = (
	areas: MentorDocument["areasOfExpertise"],
): { id: string; name?: string }[] =>
	(areas || []).map((item: unknown) => {
		const category = item as {
			_id?: IdLike;
			id?: IdLike;
			name?: string;
			toString?: () => string;
		};
		return {
			id: resolveId(category._id, category.id, category),
			name: category.name,
		};
	});

const buildSkillsSummary = (
	toolsAndSkills: MentorDocument["toolsAndSkills"],
): { id: string; name?: string }[] =>
	(toolsAndSkills || [])
		.slice(0, 3)
		.map((item: { skillId?: unknown }) => {
			const skill = item.skillId as
				| {
						_id?: IdLike;
						id?: IdLike;
						name?: string;
						toString?: () => string;
				  }
				| undefined;
			return {
				id: resolveId(skill?._id, skill?.id, skill),
				name: skill?.name,
			};
		})
		.filter((skill) => skill.id);

export const buildMentorDiscoveryDetails = (
	doc: MentorDocument,
): MentorDiscoveryDetails => {
	const mentor = MentorMapper.toDomain(doc);
	return {
		...mentor,
		user: doc.userId as unknown as {
			name: string;
			profilePictureId?: string;
		},
		currentRoleDetails: doc.currentRoleId as unknown as { name: string },
		categories: buildCategories(doc.areasOfExpertise),
		skills: buildSkillsSummary(doc.toolsAndSkills),
	};
};

export const buildMentorProfileDetails = (
	doc: MentorDocument,
): MentorProfileDetails => {
	const mentor = MentorMapper.toDomain(doc);
	return {
		...mentor,
		user: doc.userId as unknown as {
			name: string;
			email: string;
			profilePictureId?: string;
		},
		currentRoleDetails: {
			id: resolveId(
				(doc.currentRoleId as { _id?: IdLike })?._id,
				doc.currentRoleId as IdLike,
			),
			name: (doc.currentRoleId as { name?: string })?.name ?? "Unknown",
		},
		expertisesDetails: buildCategories(doc.areasOfExpertise).map((item) => ({
			id: item.id,
			name: item.name ?? "Unknown",
		})),
		skillsDetails: (doc.toolsAndSkills || []).map(
			(item: { skillId?: unknown; level?: string }) => {
				const skill = item.skillId as
					| {
							_id?: IdLike;
							name?: string;
							interestId?: IdLike;
					  }
					| undefined;
				return {
					skillId: {
						id: resolveId(skill?._id),
						name: skill?.name ?? "Unknown",
						interestId: resolveId(skill?.interestId),
					},
					level: item.level ?? "",
				};
			},
		),
	};
};

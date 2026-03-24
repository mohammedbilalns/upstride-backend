import { injectable } from "inversify";
import type { Query } from "mongoose";
import type { MentorProfileDetails } from "../../../../domain/repositories/mentor.repository.types";
import type { IMentorProfileReadRepository } from "../../../../domain/repositories/mentor-profile-read.repository.interface";
import { MentorMapper } from "../mappers/mentor.mapper";
import { type MentorDocument, MentorModel } from "../models/mentor.model";

const populateMentorProfileDetails = <ResultType>(
	query: Query<ResultType, MentorDocument>,
) =>
	query
		.populate("userId", "name email profilePictureId")
		.populate("currentRoleId", "name")
		.populate("areasOfExpertise", "name")
		.populate("toolsAndSkills.skillId", "name interestId");

const buildMentorProfileDetails = (
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
			id:
				(
					doc.currentRoleId as { _id?: { toString?: () => string } }
				)?._id?.toString?.() ?? "",
			name: (doc.currentRoleId as { name?: string })?.name ?? "Unknown",
		},
		expertisesDetails: (doc.areasOfExpertise || []).map((item: unknown) => {
			const category = item as {
				_id?: { toString?: () => string };
				name?: string;
				toString?: () => string;
			};
			return {
				id: category._id?.toString?.() || category.toString?.() || "",
				name: category.name ?? "Unknown",
			};
		}),
		skillsDetails: (doc.toolsAndSkills || []).map(
			(item: { skillId?: unknown; level?: string }) => {
				const skill = item.skillId as
					| {
							_id?: { toString?: () => string };
							name?: string;
							interestId?: { toString?: () => string };
					  }
					| undefined;
				return {
					skillId: {
						id: skill?._id?.toString?.() || "",
						name: skill?.name ?? "Unknown",
						interestId: skill?.interestId?.toString?.() || "",
					},
					level: item.level ?? "",
				};
			},
		),
	};
};

@injectable()
export class MongoMentorProfileReadRepository
	implements IMentorProfileReadRepository
{
	async findProfileByUserId(
		userId: string,
	): Promise<MentorProfileDetails | null> {
		const doc = await populateMentorProfileDetails(
			MentorModel.findOne({ userId }),
		).lean<MentorDocument>();

		if (!doc) return null;

		return buildMentorProfileDetails(doc);
	}

	async findProfileById(
		mentorId: string,
	): Promise<MentorProfileDetails | null> {
		const doc = await populateMentorProfileDetails(
			MentorModel.findById(mentorId),
		).lean<MentorDocument>();

		if (!doc) return null;

		return buildMentorProfileDetails(doc);
	}
}

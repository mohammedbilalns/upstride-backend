import { injectable } from "inversify";
import type { Query } from "mongoose";
import type { MentorProfileDetails } from "../../../../domain/repositories/mentor.repository.types";
import type { IMentorProfileReadRepository } from "../../../../domain/repositories/mentor-profile-read.repository.interface";
import { buildMentorProfileDetails } from "../mappers/mentor-details.mapper";
import { type MentorDocument, MentorModel } from "../models/mentor.model";

const populateMentorProfileDetails = <ResultType>(
	query: Query<ResultType, MentorDocument>,
) =>
	query
		.populate("userId", "name email profilePictureId")
		.populate("currentRoleId", "name")
		.populate("areasOfExpertise", "name")
		.populate("toolsAndSkills.skillId", "name interestId");

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

import { injectable } from "inversify";
import type { SavedMentor } from "../../../../domain/entities/saved-mentor.entity";
import type { MentorDiscoveryDetails } from "../../../../domain/repositories/mentor.repository.types";
import type { ISavedMentorRepository } from "../../../../domain/repositories/saved-mentor.repository.interface";
import { buildMentorDiscoveryDetails } from "../mappers/mentor-details.mapper";
import { SavedMentorMapper } from "../mappers/saved-mentor.mapper";
import type { MentorDocument } from "../models/mentor.model";
import {
	type SavedMentorDocument,
	SavedMentorModel,
} from "../models/saved-mentor.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoSavedMentorRepository
	extends AbstractMongoRepository<SavedMentor, SavedMentorDocument>
	implements ISavedMentorRepository
{
	constructor() {
		super(SavedMentorModel);
	}

	protected toDomain(doc: SavedMentorDocument): SavedMentor {
		return SavedMentorMapper.toDomain(doc);
	}

	protected toDocument(entity: SavedMentor): Partial<SavedMentorDocument> {
		return SavedMentorMapper.toDocument(entity);
	}

	async create(entity: SavedMentor): Promise<SavedMentor> {
		return this.createDocument(entity);
	}

	async findByUserMentorList(
		userId: string,
		mentorId: string,
		listId: string,
	): Promise<SavedMentor | null> {
		const doc = await this.model.findOne({ userId, mentorId, listId }).lean();
		return doc ? this.toDomain(doc as SavedMentorDocument) : null;
	}

	async findMentorsByListId(
		userId: string,
		listId: string,
	): Promise<MentorDiscoveryDetails[]> {
		const docs = await this.model
			.find({ userId, listId })
			.sort({ createdAt: -1 })
			.populate({
				path: "mentorId",
				populate: [
					{ path: "userId", select: "name profilePictureId" },
					{ path: "currentRoleId", select: "name" },
					{ path: "areasOfExpertise", select: "name" },
					{ path: "toolsAndSkills.skillId", select: "name" },
				],
			})
			.lean();

		const mentors = docs
			.map((doc) => doc.mentorId as unknown as MentorDocument | undefined)
			.filter((mentorDoc): mentorDoc is MentorDocument => Boolean(mentorDoc));

		return mentors.map((mentorDoc) => buildMentorDiscoveryDetails(mentorDoc));
	}

	async countByListId(listId: string): Promise<number> {
		return this.model.countDocuments({ listId });
	}

	async deleteByUserMentorList(
		userId: string,
		mentorId: string,
		listId: string,
	): Promise<void> {
		await this.model.deleteOne({ userId, mentorId, listId });
	}

	async deleteByListId(listId: string): Promise<void> {
		await this.model.deleteMany({ listId });
	}
}

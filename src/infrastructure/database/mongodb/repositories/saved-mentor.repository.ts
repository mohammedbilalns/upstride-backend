import { injectable } from "inversify";
import type { SavedMentor } from "../../../../domain/entities/saved-mentor.entity";
import type { MentorDiscoveryDetails } from "../../../../domain/repositories/mentor.repository.interface";
import type { ISavedMentorRepository } from "../../../../domain/repositories/saved-mentor.repository.interface";
import { MentorMapper } from "../mappers/mentor.mapper";
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

		return mentors.map((mentorDoc) => {
			const mentor = MentorMapper.toDomain(mentorDoc);
			return {
				...mentor,
				user: mentorDoc.userId as unknown as {
					name: string;
					profilePictureId?: string;
				},
				currentRoleDetails: mentorDoc.currentRoleId as unknown as {
					name: string;
				},
				categories: (mentorDoc.areasOfExpertise || []).map((item: unknown) => {
					const category = item as {
						_id?: { toString?: () => string };
						id?: { toString?: () => string };
						name?: string;
						toString?: () => string;
					};
					return {
						id:
							category._id?.toString?.() ||
							category.id?.toString?.() ||
							category.toString?.() ||
							"",
						name: category.name,
					};
				}),
				skills: (mentorDoc.toolsAndSkills || [])
					.slice(0, 3)
					.map((item: { skillId?: unknown }) => {
						const skill = item.skillId as
							| {
									_id?: { toString?: () => string };
									id?: { toString?: () => string };
									name?: string;
									toString?: () => string;
							  }
							| undefined;
						return {
							id:
								skill?._id?.toString?.() ||
								skill?.id?.toString?.() ||
								skill?.toString?.() ||
								"",
							name: skill?.name,
						};
					})
					.filter((skill) => skill.id),
			} as MentorDiscoveryDetails;
		});
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

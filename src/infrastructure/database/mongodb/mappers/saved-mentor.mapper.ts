import { Types } from "mongoose";
import { SavedMentor } from "../../../../domain/entities/saved-mentor.entity";
import type { SavedMentorDocument } from "../models/saved-mentor.model";

export class SavedMentorMapper {
	static toDomain(doc: SavedMentorDocument): SavedMentor {
		return new SavedMentor(
			doc._id.toString(),
			doc.userId.toString(),
			doc.mentorId.toString(),
			doc.listId.toString(),
			doc.createdAt,
		);
	}

	static toDocument(entity: SavedMentor): Partial<SavedMentorDocument> {
		return {
			userId: new Types.ObjectId(entity.userId),
			mentorId: new Types.ObjectId(entity.mentorId),
			listId: new Types.ObjectId(entity.listId),
		};
	}
}

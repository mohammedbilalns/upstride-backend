import { Types } from "mongoose";
import { MentorList } from "../../../../domain/entities/mentor-list.entity";
import type { MentorListDocument } from "../models/mentor-list.model";

export class MentorListMapper {
	static toDomain(doc: MentorListDocument): MentorList {
		return new MentorList(
			doc._id.toString(),
			doc.userId.toString(),
			doc.name,
			doc.description ?? null,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toDocument(entity: MentorList): Partial<MentorListDocument> {
		return {
			userId: new Types.ObjectId(entity.userId),
			name: entity.name,
			description: entity.description ?? null,
		};
	}
}

import { Types } from "mongoose";
import { Skill } from "../../../../domain/entities/skill.entity";
import type { SkillDocument } from "../models/skill.model";

export class SkillMapper {
	static toDomain(doc: SkillDocument): Skill {
		return new Skill(
			doc._id.toString(),
			doc.name,
			doc.slug,
			doc.interestId.toString(),
			doc.isActive,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toDocument(entity: Skill): Partial<SkillDocument> {
		return {
			name: entity.name,
			slug: entity.slug,
			interestId: new Types.ObjectId(entity.interestId),
			isActive: entity.isActive,
		};
	}
}

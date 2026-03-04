import { Interest } from "../../../../domain/entities/interest.entity";
import type { InterestDocument } from "../models/interests.model";

export class InterestMapper {
	static toDomain(doc: InterestDocument): Interest {
		return new Interest(
			doc._id.toString(),
			doc.name,
			doc.slug,
			doc.isActive,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toDocument(entity: Interest): Partial<InterestDocument> {
		return {
			name: entity.name,
			slug: entity.slug,
			isActive: entity.isActive,
		};
	}
}

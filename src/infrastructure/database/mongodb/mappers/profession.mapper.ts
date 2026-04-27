import { Profession } from "../../../../domain/entities/profession.entity";
import type { ProfessionDocument } from "../models/profession.model";

export class ProfessionMapper {
	static toDomain(doc: ProfessionDocument): Profession {
		return new Profession(doc._id.toString(), doc.name, doc.slug, doc.isActive);
	}

	static toDocument(entity: Profession): Partial<ProfessionDocument> {
		return {
			name: entity.name,
			slug: entity.slug,
			isActive: entity.isActive,
		};
	}
}

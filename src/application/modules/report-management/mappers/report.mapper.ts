import type { Report } from "../../../../domain/entities/report.entity";
import type { ReportDto } from "../dtos/report.dto";

export class ReportMapper {
	static toDto(entity: Report): ReportDto {
		return {
			id: entity.id,
			reporterId: entity.reporterId,
			targetId: entity.targetId,
			targetType: entity.targetType,
			reporter: entity.reporter,
			target: entity.target,
			targetSlug: entity.target?.slug,
			reason: entity.reason,
			description: entity.description,
			status: entity.status,
			actionTaken: entity.actionTaken,
			createdAt: entity.createdAt as Date,
			updatedAt: entity.updatedAt as Date,
		};
	}

	static toDtos(entities: Report[]): ReportDto[] {
		return entities.map((entity) => ReportMapper.toDto(entity));
	}
}

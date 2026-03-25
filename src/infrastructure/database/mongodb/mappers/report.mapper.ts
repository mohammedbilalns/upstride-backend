import { Types } from "mongoose";
import { Report } from "../../../../domain/entities/report.entity";
import type { ReportDocument } from "../models/report.model";

export class ReportMapper {
	static toDomain(doc: ReportDocument): Report {
		return new Report(
			doc._id.toString(),
			doc.reporterId.toString(),
			doc.targetId.toString(),
			doc.targetType,
			doc.reason,
			doc.description,
			doc.status,
			doc.actionTaken ?? "",
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toDocument(entity: Report): Partial<ReportDocument> {
		return {
			reporterId: new Types.ObjectId(entity.reporterId),
			targetId: new Types.ObjectId(entity.targetId),
			targetType: entity.targetType,
			reason: entity.reason,
			description: entity.description,
			status: entity.status,
			actionTaken: entity.actionTaken,
			...(entity.createdAt && { createdAt: entity.createdAt }),
		};
	}
}

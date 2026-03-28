import { Types } from "mongoose";
import { Report } from "../../../../domain/entities/report.entity";
import type { ReportDocument } from "../models/report.model";

export class ReportMapper {
	static toDomain(doc: any): Report {
		const reporterId = doc.reporterId?._id
			? doc.reporterId._id.toString()
			: doc.reporterId?.toString();
		const targetId = doc.targetId?._id
			? doc.targetId._id.toString()
			: doc.targetId?.toString();

		const reporter = doc.reporterId?._id
			? {
					id: reporterId,
					name: doc.reporterId.name,
					email: doc.reporterId.email,
				}
			: undefined;

		const target = doc.targetId?._id
			? {
					id: targetId,
					name: doc.targetId.name,
					email: doc.targetId.email,
					title: doc.targetId.title,
					slug: doc.targetId.slug,
				}
			: undefined;

		return new Report(
			doc._id.toString(),
			reporterId,
			targetId,
			doc.targetType,
			doc.reason,
			doc.description,
			doc.status,
			doc.actionTaken ?? "",
			doc.createdAt,
			doc.updatedAt,
			reporter,
			target,
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

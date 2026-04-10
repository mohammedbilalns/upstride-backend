import { Types } from "mongoose";
import { Report } from "../../../../domain/entities/report.entity";
import type { ReportDocument } from "../models/report.model";

export class ReportMapper {
	static toDomain(doc: ReportDocumentWithRefs): Report {
		const reporterId = getIdString(doc.reporterId);
		const targetId = getIdString(doc.targetId);

		const reporter = buildReporter(doc.reporterId, reporterId);
		const target = buildTarget(doc.targetType, doc.targetId, targetId);

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
			doc.actionTakenAt ?? null,
			reporter,
			target,
			doc.appealMessage ?? null,
			doc.appealedAt ?? null,
			doc.isAppealSubmitted ?? false,
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
			actionTakenAt: entity.actionTakenAt,
			appealMessage: entity.appealMessage,
			appealedAt: entity.appealedAt,
			isAppealSubmitted: entity.isAppealSubmitted,
			...(entity.createdAt && { createdAt: entity.createdAt }),
		};
	}
}

type PopulatedUserRef = {
	_id: Types.ObjectId;
	name?: string;
	email?: string;
	isBlocked?: boolean;
	blockingReason?: string;
};

type PopulatedArticleRef = {
	_id: Types.ObjectId;
	title?: string;
	slug?: string;
};

export type ReportDocumentWithRefs = Omit<
	ReportDocument,
	"reporterId" | "targetId"
> & {
	reporterId: Types.ObjectId | PopulatedUserRef;
	targetId: Types.ObjectId | PopulatedUserRef | PopulatedArticleRef;
};

const isPopulatedRef = (
	ref: Types.ObjectId | PopulatedUserRef | PopulatedArticleRef,
): ref is PopulatedUserRef | PopulatedArticleRef =>
	typeof ref === "object" && ref !== null && "_id" in ref;

const getIdString = (
	ref: Types.ObjectId | PopulatedUserRef | PopulatedArticleRef,
): string => (isPopulatedRef(ref) ? ref._id.toString() : ref.toString());

const buildReporter = (
	reporterRef: Types.ObjectId | PopulatedUserRef,
	reporterId: string,
): { id: string; name: string; email: string } | undefined => {
	if (!isPopulatedRef(reporterRef)) return undefined;
	if (typeof reporterRef.name !== "string") return undefined;
	if (typeof reporterRef.email !== "string") return undefined;
	return { id: reporterId, name: reporterRef.name, email: reporterRef.email };
};

const buildTarget = (
	targetType: ReportDocumentWithRefs["targetType"],
	targetRef: Types.ObjectId | PopulatedUserRef | PopulatedArticleRef,
	targetId: string,
):
	| {
			id: string;
			name?: string;
			email?: string;
			title?: string;
			slug?: string;
			blockingReason?: string;
			isBlocked?: boolean;
	  }
	| undefined => {
	if (!isPopulatedRef(targetRef)) return undefined;

	if (targetType === "USER" && isPopulatedUserTarget(targetRef)) {
		return {
			id: targetId,
			name: targetRef.name,
			email: targetRef.email,
			blockingReason: targetRef.blockingReason,
			isBlocked: targetRef.isBlocked,
		};
	}

	if (targetType === "ARTICLE" && isPopulatedArticleTarget(targetRef)) {
		return {
			id: targetId,
			title: targetRef.title,
			slug: targetRef.slug,
		};
	}

	return undefined;
};

const isPopulatedUserTarget = (
	ref: PopulatedUserRef | PopulatedArticleRef,
): ref is PopulatedUserRef => {
	return (
		"name" in ref ||
		"email" in ref ||
		"isBlocked" in ref ||
		"blockingReason" in ref
	);
};

const isPopulatedArticleTarget = (
	ref: PopulatedUserRef | PopulatedArticleRef,
): ref is PopulatedArticleRef => {
	return "title" in ref || "slug" in ref;
};

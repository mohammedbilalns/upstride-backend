import { injectable } from "inversify";
import type { QueryFilter, Types } from "mongoose";
import type { Report } from "../../../../domain/entities/report.entity";
import type { PaginateParams } from "../../../../domain/repositories";
import type { QueryParams } from "../../../../domain/repositories/capabilities";
import type { PaginatedResult } from "../../../../domain/repositories/capabilities/paginatable.repository.interface";
import type {
	IReportRepository,
	ReportQuery,
} from "../../../../domain/repositories/report.repository.interface";
import {
	type ReportDocumentWithRefs,
	ReportMapper,
} from "../mappers/report.mapper";
import { type ReportDocument, ReportModel } from "../models/report.model";
import { AbstractMongoRepository } from "./abstract.repository";

type LeanReportDoc = ReportDocument & { _id: Types.ObjectId; __v: number };

@injectable()
export class MongoReportRepository
	extends AbstractMongoRepository<Report, ReportDocument>
	implements IReportRepository
{
	constructor() {
		super(ReportModel);
	}

	protected toDomain(doc: ReportDocument): Report {
		return ReportMapper.toDomain(doc);
	}

	protected toDocument(entity: Report): Partial<ReportDocument> {
		return ReportMapper.toDocument(entity);
	}

	async create(report: Report): Promise<Report> {
		return this.createDocument(report);
	}

	async findById(id: string): Promise<Report | null> {
		return this.findByIdDocument(id);
	}

	async updateById(
		id: string,
		update: Partial<Report>,
	): Promise<Report | null> {
		const doc = await this.model
			.findByIdAndUpdate(id, update, { returnDocument: "after" })
			.lean();
		return doc ? this.toDomain(doc as ReportDocument) : null;
	}

	async query({ query, sort }: QueryParams<ReportQuery>): Promise<Report[]> {
		const filter = this._buildFilter(query);
		let docs = (await this.model
			.find(filter)
			.sort(sort ?? { createdAt: -1 })
			.lean()) as LeanReportDoc[];

		docs = await this._populateDocs(docs);
		return docs.map((doc) =>
			ReportMapper.toDomain(doc as ReportDocumentWithRefs),
		);
	}

	async paginate({
		page,
		limit,
		query,
		sort,
	}: PaginateParams<ReportQuery>): Promise<PaginatedResult<Report>> {
		const filter = this._buildFilter(query);
		const skip = (page - 1) * limit;

		let [docs, total] = await Promise.all([
			this.model
				.find(filter)
				.sort(sort ?? { createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			this.model.countDocuments(filter),
		]);

		docs = await this._populateDocs(docs as LeanReportDoc[]);

		const items = docs.map((doc) =>
			ReportMapper.toDomain(doc as ReportDocumentWithRefs),
		);
		return this.buildPaginatedResult(items, total, page, limit);
	}

	private _buildFilter(query?: ReportQuery): QueryFilter<ReportDocument> {
		const filter: QueryFilter<ReportDocument> = {};

		if (!query) return filter;

		Object.assign(filter, {
			...(query.reporterId && { reporterId: query.reporterId }),
			...(query.targetId && { targetId: query.targetId }),
		});

		if (query.targetType) {
			filter.targetType = Array.isArray(query.targetType)
				? { $in: query.targetType }
				: query.targetType;
		}

		if (query.status) {
			filter.status = Array.isArray(query.status)
				? { $in: query.status }
				: query.status;
		}

		return filter;
	}

	private async _populateDocs(docs: LeanReportDoc[]): Promise<LeanReportDoc[]> {
		if (!docs.length) return docs;

		// Populate reporters unconditionally
		await this.model.populate(docs, {
			path: "reporterId",
			model: "User",
			select: "name email",
		});

		// Categorize targets by type for specific populates
		const userDocs = docs.filter((d) => d.targetType === "USER");
		if (userDocs.length > 0) {
			await this.model.populate(userDocs, {
				path: "targetId",
				model: "User",
				select: "name email isBlocked",
			});
		}

		const articleDocs = docs.filter((d) => d.targetType === "ARTICLE");
		if (articleDocs.length > 0) {
			await this.model.populate(articleDocs, {
				path: "targetId",
				model: "Article",
				select: "title slug",
			});
		}

		return docs;
	}
	async getStats() {
		const stats = await this.model.aggregate([
			{
				$facet: {
					totalReports: [{ $count: "count" }],
					pendingReports: [
						{ $match: { status: "PENDING" } },
						{ $count: "count" },
					],
					appealedReports: [
						{ $match: { isAppealSubmitted: true } },
						{ $count: "count" },
					],
				},
			},
		]);

		const res = stats[0];
		return {
			totalReports: res.totalReports[0]?.count || 0,
			pendingReports: res.pendingReports[0]?.count || 0,
			appealedReports: res.appealedReports[0]?.count || 0,
		};
	}
}

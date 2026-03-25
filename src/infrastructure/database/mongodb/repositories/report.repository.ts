import { injectable } from "inversify";
import type { QueryFilter } from "mongoose";
import type { Report } from "../../../../domain/entities/report.entity";
import type { PaginateParams } from "../../../../domain/repositories";
import type { QueryParams } from "../../../../domain/repositories/capabilities";
import type { PaginatedResult } from "../../../../domain/repositories/capabilities/paginatable.repository.interface";
import type {
	IReportRepository,
	ReportQuery,
} from "../../../../domain/repositories/report.repository.interface";
import { ReportMapper } from "../mappers/report.mapper";
import { type ReportDocument, ReportModel } from "../models/report.model";
import { AbstractMongoRepository } from "./abstract.repository";

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
		const docs = await this.model
			.find(filter)
			.sort(sort ?? { createdAt: -1 })
			.lean();
		return docs.map((doc) => this.toDomain(doc as ReportDocument));
	}

	async paginate({
		page,
		limit,
		query,
		sort,
	}: PaginateParams<ReportQuery>): Promise<PaginatedResult<Report>> {
		const filter = this._buildFilter(query);
		const skip = (page - 1) * limit;

		const [docs, total] = await Promise.all([
			this.model
				.find(filter)
				.sort(sort ?? { createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			this.model.countDocuments(filter),
		]);

		const items = docs.map((doc) => this.toDomain(doc as ReportDocument));
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
}

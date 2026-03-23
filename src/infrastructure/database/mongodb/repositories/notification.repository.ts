import { injectable } from "inversify";
import type { QueryFilter } from "mongoose";
import type { Notification } from "../../../../domain/entities/notification.entity";
import type { PaginateParams } from "../../../../domain/repositories";
import type { QueryParams } from "../../../../domain/repositories/capabilities";
import type { PaginatedResult } from "../../../../domain/repositories/capabilities/paginatable.repository.interface";
import type {
	INotificationRepository,
	NotificationQuery,
} from "../../../../domain/repositories/notification.repository.interface";
import { NotificationMapper } from "../mappers/notification.mapper";
import {
	type NotificationDocument,
	NotificationModel,
} from "../models/notification.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoNotificationRepository
	extends AbstractMongoRepository<Notification, NotificationDocument>
	implements INotificationRepository
{
	constructor() {
		super(NotificationModel);
	}

	protected toDomain(doc: NotificationDocument): Notification {
		return NotificationMapper.toDomain(doc);
	}

	protected toDocument(entity: Notification): Partial<NotificationDocument> {
		return NotificationMapper.toDocument(entity);
	}

	async create(notification: Notification): Promise<Notification> {
		return this.createDocument(notification);
	}

	async findById(id: string): Promise<Notification | null> {
		return this.findByIdDocument(id);
	}

	async updateById(
		id: string,
		update: Partial<Notification>,
	): Promise<Notification | null> {
		const doc = await this.model
			.findByIdAndUpdate(id, update, { returnDocument: "after" })
			.lean();

		return doc ? this.toDomain(doc as NotificationDocument) : null;
	}

	async query({
		query,
		sort,
	}: QueryParams<NotificationQuery>): Promise<Notification[]> {
		const filter = this._buildFilter(query);

		const docs = await this.model
			.find(filter)
			.sort(sort ?? { createdAt: -1 })
			.lean();

		return docs.map((doc) => this.toDomain(doc as NotificationDocument));
	}

	async paginate({
		page,
		limit,
		query,
		sort,
	}: PaginateParams<NotificationQuery>): Promise<
		PaginatedResult<Notification>
	> {
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

		const items = docs.map((doc) => this.toDomain(doc as NotificationDocument));

		return this.buildPaginatedResult(items, total, page, limit);
	}

	private _buildFilter(
		query?: NotificationQuery,
	): QueryFilter<NotificationDocument> {
		const filter: QueryFilter<NotificationDocument> = {};

		if (!query) return filter;

		Object.assign(filter, {
			...(query.userId && { userId: query.userId }),
			...(query.actorId && { actorId: query.actorId }),
			...(query.isRead !== undefined && { isRead: query.isRead }),
		});

		if (query.type) {
			filter.type = Array.isArray(query.type)
				? { $in: query.type }
				: query.type;
		}

		if (query.event) {
			filter.event = Array.isArray(query.event)
				? { $in: query.event }
				: query.event;
		}

		return filter;
	}
}

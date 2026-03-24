import { injectable } from "inversify";
import type { QueryFilter } from "mongoose";
import type { Chatmessage } from "../../../../domain/entities/chat-message.entity";
import type { PaginateParams } from "../../../../domain/repositories";
import type { QueryParams } from "../../../../domain/repositories/capabilities";
import type { PaginatedResult } from "../../../../domain/repositories/capabilities/paginatable.repository.interface";
import type {
	ChatMessageQuery,
	IChatMessageRepository,
} from "../../../../domain/repositories/chat-message.repository.interface";
import { ChatMessageMapper } from "../mappers/chat-message.mapper";
import {
	type ChatMessageDocument,
	ChatMessageModel,
} from "../models/chat-message.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoChatMessageRepository
	extends AbstractMongoRepository<Chatmessage, ChatMessageDocument>
	implements IChatMessageRepository
{
	constructor() {
		super(ChatMessageModel);
	}

	protected toDomain(doc: ChatMessageDocument): Chatmessage {
		return ChatMessageMapper.toDomain(doc);
	}

	protected toDocument(entity: Chatmessage): Partial<ChatMessageDocument> {
		return ChatMessageMapper.toDocument(entity);
	}

	async create(message: Chatmessage): Promise<Chatmessage> {
		return this.createDocument(message);
	}

	async findById(id: string): Promise<Chatmessage | null> {
		return this.findByIdDocument(id);
	}

	async updateById(
		id: string,
		update: Partial<Chatmessage>,
	): Promise<Chatmessage | null> {
		const doc = await this.model
			.findByIdAndUpdate(id, update, { returnDocument: "after" })
			.lean();

		return doc ? this.toDomain(doc as ChatMessageDocument) : null;
	}

	async query({
		query,
		sort,
	}: QueryParams<ChatMessageQuery>): Promise<Chatmessage[]> {
		const filter = this._buildFilter(query);

		const docs = await this.model
			.find(filter)
			.sort(sort ?? { createdAt: -1 })
			.lean();

		return docs.map((doc) => this.toDomain(doc as ChatMessageDocument));
	}

	async paginate({
		page,
		limit,
		query,
		sort,
	}: PaginateParams<ChatMessageQuery>): Promise<PaginatedResult<Chatmessage>> {
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

		const items = docs.map((doc) => this.toDomain(doc as ChatMessageDocument));

		return this.buildPaginatedResult(items, total, page, limit);
	}

	private _buildFilter(
		query?: ChatMessageQuery,
	): QueryFilter<ChatMessageDocument> {
		const filter: QueryFilter<ChatMessageDocument> = {};

		if (!query) return filter;

		Object.assign(filter, {
			...(query.chatId && { chatId: query.chatId }),
			...(query.senderId && { senderId: query.senderId }),
			...(query.status && { status: query.status }),
		});

		return filter;
	}
}

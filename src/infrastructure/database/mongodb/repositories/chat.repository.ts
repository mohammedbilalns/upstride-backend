import { injectable } from "inversify";
import type { QueryFilter } from "mongoose";
import type { Chat } from "../../../../domain/entities/chat.entity";
import type { IChatRepository } from "../../../../domain/repositories/chat.repository.interface";
import { ChatMapper } from "../mappers/chat.mapper";
import { type ChatDocument, ChatModel } from "../models/chat.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoChatRepository
	extends AbstractMongoRepository<Chat, ChatDocument>
	implements IChatRepository
{
	constructor() {
		super(ChatModel);
	}

	protected toDomain(doc: ChatDocument): Chat {
		return ChatMapper.toDomain(doc);
	}

	protected toDocument(entity: Chat): Partial<ChatDocument> {
		return ChatMapper.toDocument(entity);
	}

	async create(chat: Chat): Promise<Chat> {
		return this.createDocument(chat);
	}

	async findById(id: string): Promise<Chat | null> {
		return this.findByIdDocument(id);
	}

	async updateById(id: string, update: Partial<Chat>): Promise<Chat | null> {
		const doc = await this.model
			.findByIdAndUpdate(id, update, { returnDocument: "after" })
			.lean();

		return doc ? this.toDomain(doc as ChatDocument) : null;
	}

	async findByUserId(userId: string): Promise<Chat[]> {
		const filter: QueryFilter<ChatDocument> = {
			$or: [{ user1Id: userId }, { user2Id: userId }],
		};

		const docs = await this.model.find(filter).sort({ updatedAt: -1 }).lean();
		return docs.map((doc) => this.toDomain(doc as ChatDocument));
	}

	async findByParticipants(
		user1Id: string,
		user2Id: string,
	): Promise<Chat | null> {
		const filter: QueryFilter<ChatDocument> = {
			$or: [
				{ user1Id, user2Id },
				{ user1Id: user2Id, user2Id: user1Id },
			],
		};

		const doc = await this.model.findOne(filter).lean();
		return doc ? this.toDomain(doc as ChatDocument) : null;
	}

	async paginateByUser(
		userId: string,
		filter: "read" | "unread" | "all",
		page: number,
		limit: number,
	): Promise<{
		items: Chat[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		const userFilter: QueryFilter<ChatDocument> = {
			$or: [{ user1Id: userId }, { user2Id: userId }],
		};

		const unreadKey = `unreadCount.${userId}`;
		const readFilter: QueryFilter<ChatDocument> =
			filter === "unread"
				? { [unreadKey]: { $gt: 0 } }
				: filter === "read"
					? {
							$or: [{ [unreadKey]: { $exists: false } }, { [unreadKey]: 0 }],
						}
					: {};

		const combinedFilter: QueryFilter<ChatDocument> = {
			$and: [userFilter, readFilter],
		};

		const skip = (page - 1) * limit;

		const [docs, total] = await Promise.all([
			this.model
				.find(combinedFilter)
				.sort({ updatedAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			this.model.countDocuments(combinedFilter),
		]);

		const items = docs.map((doc) => this.toDomain(doc as ChatDocument));

		return this.buildPaginatedResult(items, total, page, limit);
	}
}

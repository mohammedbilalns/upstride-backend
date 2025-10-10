import { IReactionRepository } from "../../../domain/repositories";
import type { Reaction } from "../../../domain/entities/reaction.entity";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import {
	ReactionModel,
	type IReaction,
} from "../models/reaction.model";
import { BaseRepository } from "./base.repository";

export class ReactionRepository
extends BaseRepository<Reaction, IReaction>
implements IReactionRepository
{
	constructor() {
		super(ReactionModel);
	}
	protected mapToDomain(doc: IReaction): Reaction {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			resourceId: mapped.resourceId,
			userId: mapped.userId,
			userName: mapped.userName,
			userImage: mapped.userImage,
			reaction: mapped.reaction,
			createdAt: mapped.createdAt,
		};
	}

	async findByResource(
		resourceId: string,
		page: number,
		limit: number,
	): Promise<Reaction[]> {
		const articles = await this._model
			.find({resourceId })
			.skip(page * limit)
			.limit(limit)
			.lean()
			.exec();
		return articles.map(this.mapToDomain);
	}

	async findByResourceAndUser(
		resourceId: string,
		userId: string,
	): Promise<Reaction | null> {
		const article = await this._model
			.findOne({ resourceId, userId: userId })
			.lean()
			.exec();
		return article ? this.mapToDomain(article) : null;
	}
}

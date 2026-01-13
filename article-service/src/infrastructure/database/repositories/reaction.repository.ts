import { AppError } from "../../../application/errors/app-error";
import { ErrorMessage } from "../../../common/enums";
import type { Reaction } from "../../../domain/entities/reaction.entity";
import type { IReactionRepository } from "../../../domain/repositories";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { type IReaction, ReactionModel } from "../models/reaction.model";
import { BaseRepository } from "./base.repository";

export class ReactionRepository
	extends BaseRepository<Reaction, IReaction>
	implements IReactionRepository
{
	constructor() {
		super(ReactionModel);
	}
	protected mapToDomain(doc: IReaction): Reaction {
		const mapped = mapMongoDocument(doc);
		if (!mapped) throw new AppError(ErrorMessage.FAILED_TO_MAP_TO_DOMAIN);
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
			.find({ resourceId })
			.skip(page * limit)
			.limit(limit)
			.lean()
			.exec();

		return articles.map((doc) => this.mapToDomain(doc as unknown as IReaction));
	}

	async findByResourceAndUser(
		resourceId: string,
		userId: string,
	): Promise<Reaction | null> {
		const reaction = await this._model
			.findOne({ resourceId, userId: userId })
			.exec();
		return reaction ? this.mapToDomain(reaction) : null;
	}
	async existsByResourceAndUser(
		resourceId: string,
		userId: string,
	): Promise<boolean> {
		const exists = await this._model
			.exists({ resourceId, userId: userId })
			.exec();
		return !!exists;
	}

	async deleteByArticle(articleId: string): Promise<void> {
		await this._model.deleteMany({ resourceId: articleId });
	}
	async deleteByComments(commentIds: string[]): Promise<void> {
		await this._model.deleteMany({ resourceId: { $in: commentIds } });
	}
}

import { ErrorMessage, HttpStatus } from "../../common/enums";
import type { Reaction } from "../../domain/entities/reaction.entity";
import type {
	IReactionRepository,
	IArticleRepository,
} from "../../domain/repositories";
import { IReactionService } from "../../domain/services";
import type { ReactionDto } from "../dtos/reaction.dto";

import { AppError } from "../errors/AppError";

export class ReactionService implements IReactionService {
	constructor(
		private _articleRectionRepository: IReactionRepository,
		private _articleRepository: IArticleRepository,
	) {}

	async reactToResource(ReactionDto: ReactionDto): Promise<void> {
		const { resourceId, userId, reaction } = ReactionDto;
		const article = await this._articleRepository.findById(resourceId);
		if (!article)
			throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);
		const existingReaction =
			await this._articleRectionRepository.findByResourceAndUser(
				resourceId,
				userId,
			);
		if (existingReaction) {
			if (existingReaction.reaction === reaction) {
				throw new AppError(
					ErrorMessage.ARTICLE_ALREADY_REACTED,
					HttpStatus.BAD_REQUEST,
				);
			}
			await this._articleRectionRepository.update(existingReaction.id, {
				reaction,
			});
		} else {
			await this._articleRectionRepository.create({
				resourceId,
				userId,
				reaction,
			});
		}
		if (reaction === "like") {
			this._articleRepository.update(article.id, { likes: article.likes + 1 });
		} else if (reaction === "dislike") {
			this._articleRepository.update(article.id, { likes: article.likes - 1 });
		}
	}

	async getReactions(
		resourceId: string,
		page: number,
		limit: number,
	): Promise<Partial<Reaction>[]> {
		return await this._articleRectionRepository.findByResource(
			resourceId,
			page,
			limit,
		);
	}
}

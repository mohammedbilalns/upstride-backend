import { ErrorMessage, HttpStatus } from "../../common/enums";
import type { Reaction } from "../../domain/entities/reaction.entity";
import type {
	IReactionRepository,
	IArticleRepository,
	IArticleCommentRepository,
} from "../../domain/repositories";
import { IReactionService } from "../../domain/services";
import type { ReactionDto } from "../dtos/reaction.dto";
import { AppError } from "../errors/AppError";

export class ReactionService implements IReactionService {
	constructor(
		private _reactionRepository: IReactionRepository,
		private _articleRepository: IArticleRepository,
		private _articleCommentRepository: IArticleCommentRepository,
	) {}

	private getResourceHandlers(resourceType: "article" | "comment") {
		switch (resourceType) {
			case "article":
				return {
					repository: this._articleRepository,
					notFoundError: ErrorMessage.ARTICLE_NOT_FOUND,
					alreadedReactedError: ErrorMessage.ARTICLE_ALREADY_REACTED,
				};
			case "comment":
				return {
					repository: this._articleCommentRepository,
					notFoundError: ErrorMessage.ARTICLE_COMMENT_NOT_FOUND,
					alreadedReactedError: ErrorMessage.ARTICLE_COMMENT_ALREADY_REACTED,
				};
			default:
				throw new Error("Invalid resource type");
		}
	}

	async reactToResource(dto: ReactionDto): Promise<void> {
		const { resourceId,resourceType, userId, reaction } = dto;
		const { repository, notFoundError, alreadedReactedError } = this.getResourceHandlers(resourceType);
		// find the resource 
		const resource = await repository.findById(resourceId);
		if (!resource)
			throw new AppError(notFoundError, HttpStatus.NOT_FOUND);

		// fetch the existing reaction
		const existingReaction = await this._reactionRepository.findByResourceAndUser(
			userId,
			resourceId,
		);

		// handle create/update reaction
		if(existingReaction){
			if(existingReaction.reaction === reaction) throw new AppError(alreadedReactedError, HttpStatus.BAD_REQUEST);
			await this._reactionRepository.update(existingReaction.id, { reaction });
		}else{
			await this._reactionRepository.create({resourceId, userId, reaction});
		}

		// update likes count in the resource
		const likesChanged = reaction === "like" ? 1 : -1;
		await repository.update(resourceId, {likes:(resource.likes ?? 0) + likesChanged});

	}

	async getReactions(
		resourceId: string,
		page: number,
		limit: number,
	): Promise<Partial<Reaction>[]> {
		return await this._reactionRepository.findByResource(
			resourceId,
			page,
			limit,
		);
	}
}

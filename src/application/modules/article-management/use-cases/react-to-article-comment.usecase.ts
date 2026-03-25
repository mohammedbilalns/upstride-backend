import { inject, injectable } from "inversify";
import { ArticleReaction } from "../../../../domain/entities/article-reaction.entity";
import type {
	IArticleCommentRepository,
	IArticleReactionRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type {
	ReactToArticleCommentInput,
	ReactToArticleCommentOutput,
} from "../dtos/article-input.dto";
import { ArticleCommentNotFoundError } from "../errors";
import { ArticleReactionMapper } from "../mappers/article-reaction.mapper";
import type { IReactToArticleCommentUseCase } from "./react-to-article-comment.usecase.interface";

@injectable()
export class ReactToArticleCommentUseCase
	implements IReactToArticleCommentUseCase
{
	constructor(
		@inject(TYPES.Repositories.ArticleCommentRepository)
		private readonly _commentRepository: IArticleCommentRepository,
		@inject(TYPES.Repositories.ArticleReactionRepository)
		private readonly _reactionRepository: IArticleReactionRepository,
	) {}

	async execute(
		input: ReactToArticleCommentInput,
	): Promise<ReactToArticleCommentOutput> {
		const comment = await this._commentRepository.findById(input.commentId);
		if (!comment || !comment.isActive) {
			throw new ArticleCommentNotFoundError();
		}

		const existing = await this._reactionRepository.query({
			query: { resourceId: input.commentId, userId: input.userId },
		});

		if (existing.length > 0) {
			const current = existing[0];
			if (current.reactionType === input.reactionType) {
				return { reaction: ArticleReactionMapper.toDto(current) };
			}

			const updated = await this._reactionRepository.updateById(current.id, {
				reactionType: input.reactionType,
			});

			if (current.reactionType !== input.reactionType) {
				const likesDelta =
					current.reactionType === "LIKE" && input.reactionType === "DISLIKE"
						? -1
						: current.reactionType === "DISLIKE" &&
								input.reactionType === "LIKE"
							? 1
							: 0;

				if (likesDelta !== 0) {
					await this._commentRepository.updateById(comment.id, {
						likesCount: Math.max(0, comment.likesCount + likesDelta),
					});
				}
			}

			if (updated) {
				return { reaction: ArticleReactionMapper.toDto(updated) };
			}
		}

		const reaction = new ArticleReaction(
			"",
			input.commentId,
			input.userId,
			input.reactionType,
			null,
		);

		const created = await this._reactionRepository.create(reaction);
		if (input.reactionType === "LIKE") {
			await this._commentRepository.updateById(comment.id, {
				likesCount: comment.likesCount + 1,
			});
		}
		return { reaction: ArticleReactionMapper.toDto(created) };
	}
}

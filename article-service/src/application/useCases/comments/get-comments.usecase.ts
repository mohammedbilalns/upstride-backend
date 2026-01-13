import { ErrorMessage, HttpStatus } from "../../../common/enums";
import {
	IArticleCommentRepository,
	IArticleRepository,
	IReactionRepository,
} from "../../../domain/repositories";
import { IGetCommentsUC } from "../../../domain/useCases/comments/get-comments.usecase.interface";
import {
	FetchCommentsDto,
	fetchCommentsResponseDto,
} from "../../dtos/article-comment.dto";
import { AppError } from "../../errors/app-error";

export class GetCommentsUC implements IGetCommentsUC {
	constructor(
		private _articleRepository: IArticleRepository,
		private _commentRepository: IArticleCommentRepository,
		private _reactionRepository: IReactionRepository,
	) {}

	async execute(
		fetchCriteria: FetchCommentsDto,
	): Promise<fetchCommentsResponseDto> {
		const article = await this._articleRepository.findById(
			fetchCriteria.articleId,
		);
		if (!article)
			throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);

		const { comments, total } = await this._commentRepository.findByArticle(
			fetchCriteria.articleId,
			fetchCriteria.page,
			fetchCriteria.limit,
			fetchCriteria.parentCommentId,
		);

		const commentsWithIsLiked = await Promise.all(
			comments.map(async (comment) => {
				const userReaction =
					await this._reactionRepository.findByResourceAndUser(
						comment.id,
						fetchCriteria.userId,
					);
				const isLiked = userReaction?.reaction === "like";

				if (!comment.isActive) {
					return {
						id: comment.id,
						isDeleted: true,
						isActive: false,
						createdAt: comment.createdAt,
						userName: comment.userName,
						replies: comment.replies,
						likes: comment.likes,
						isLiked,
						parentCommentId: comment.parentId ?? null,
					};
				}

				return {
					...comment,
					isLiked,
					isDeleted: false,
				};
			}),
		);

		return {
			comments: commentsWithIsLiked,
			total,
		};
	}
}

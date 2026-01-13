import { ErrorMessage, HttpStatus } from "../../../../common/enums";
import { Tag } from "../../../../domain/entities/tag.entity";
import {
	IArticleCommentRepository,
	IArticleRepository,
	IArticleViewRepository,
	IReactionRepository,
	ITagRepository,
} from "../../../../domain/repositories";
import { IArticleCacheService } from "../../../../domain/services/article-cache.service.interface";
import { IDeleteArticleUC } from "../../../../domain/useCases/article/write/deleteArticle.usecase.interface";
import { DeleteArticleDto } from "../../../dtos/article.dto";
import { AppError } from "../../../errors/AppError";

export class DeleteArticleUC implements IDeleteArticleUC {
	constructor(
		private _articleRepository: IArticleRepository,
		private _commentRepository: IArticleCommentRepository,
		private _tagRepository: ITagRepository,
		private _articleViewRepository: IArticleViewRepository,
		private _articleReactionRepository: IReactionRepository,
		private _articleCacheService: IArticleCacheService,
	) {}

	async execute(deleteRequest: DeleteArticleDto): Promise<void> {
		const article = await this._articleRepository.findByArticleId(
			deleteRequest.articleId,
		);
		if (!article) {
			throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		if (article.author !== deleteRequest.userId) {
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
		}
		const tags = article.tags
			.filter((tag): tag is Tag => typeof tag !== "string")
			.map((tag) => tag.name);
		const comments = await this._commentRepository.fetchCommentsByArticle(
			deleteRequest.articleId,
		);

		await Promise.all([
			this._articleRepository.delete(deleteRequest.articleId),
			this._tagRepository.deleteOrDecrement(tags),
			this._articleViewRepository.deleteByArticle(deleteRequest.articleId),
			this._articleReactionRepository.deleteByComments(comments),
			this._commentRepository.deleteByArticle(deleteRequest.articleId),
			this._articleReactionRepository.deleteByArticle(deleteRequest.articleId),
			this._articleCacheService.clearArticleCache(deleteRequest.articleId),
		]);
	}
}

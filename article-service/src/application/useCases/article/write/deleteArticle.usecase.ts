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

	async execute(dto: DeleteArticleDto): Promise<void> {
		const article = await this._articleRepository.findByArticleId(
			dto.articleId,
		);
		if (!article) {
			throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		if (article.author !== dto.userId) {
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
		}
		const tags = article.tags
			.filter((tag): tag is Tag => typeof tag !== "string")
			.map((tag) => tag.name);
		const comments = await this._commentRepository.fetchCommentsByArticle(
			dto.articleId,
		);

		await Promise.all([
			this._articleRepository.delete(dto.articleId),
			this._tagRepository.deleteOrDecrement(tags),
			this._articleViewRepository.deleteByArticle(dto.articleId),
			this._articleReactionRepository.deleteByComments(comments),
			this._commentRepository.deleteByArticle(dto.articleId),
			this._articleReactionRepository.deleteByArticle(dto.articleId),
			this._articleCacheService.clearArticleCache(dto.articleId),
		]);
	}
}

import { ErrorMessage, HttpStatus } from "../../common/enums";
import type {
	IArticleCommentRepository,
	IArticleRepository,
} from "../../domain/repositories";
import type { IArticleCommentService } from "../../domain/services/articleComment.service.interface";
import type {
	ArticleCommentDto,
	ArticleCommentUpdateDto,
	fetchCommentsDto,
	fetchCommentsResponseDto,
} from "../dtos/articleComment.dto";

import { AppError } from "../errors/AppError";

export class ArticleCommentService implements IArticleCommentService {
	constructor(
		private _articleCommentRepository: IArticleCommentRepository,
		private _articleRepository: IArticleRepository,
	) {}

	async createComment(articleCommentDto: ArticleCommentDto): Promise<void> {
		const { articleId, userId, content, parentId } = articleCommentDto;
		const article = await this._articleRepository.findById(articleId);
		if (!article)
			throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);

		await Promise.all([
			this._articleCommentRepository.create({
				articleId,
				userId,
				content,
				parentId,
			}),
			this._articleRepository.update(article.id, {
				comments: article.comments + 1,
			}),
		]);
	}

	async updateComment(
		articleCommentUpdateDto: ArticleCommentUpdateDto,
	): Promise<void> {
		const { id, content, userId } = articleCommentUpdateDto;
		const comment = await this._articleCommentRepository.findById(id);
		if (!comment)
			throw new AppError(
				ErrorMessage.ARTICLE_COMMENT_NOT_FOUND,
				HttpStatus.NOT_FOUND,
			);
		if (comment.userId !== userId)
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
		await this._articleCommentRepository.update(id, { content });
	}

	async getComments(
		fetchCommentsDto: fetchCommentsDto,
	): Promise<fetchCommentsResponseDto> {
		const { articleId, page, limit, parentId } = fetchCommentsDto;
		const article = await this._articleRepository.findById(articleId);
		if (!article)
			throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);

		return await this._articleCommentRepository.findByArticle(
			articleId,
			page,
			limit,
			parentId,
		);
	}

	async deleteComment(id: string): Promise<void> {
		const comment = await this._articleCommentRepository.findById(id);
		if (!comment)
			throw new AppError(
				ErrorMessage.ARTICLE_COMMENT_NOT_FOUND,
				HttpStatus.NOT_FOUND,
			);

		const article = await this._articleRepository.findById(comment.articleId);
		if (!article)
			throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);
		await Promise.all([
			this._articleCommentRepository.delete(id),
			this._articleRepository.update(comment.articleId, {
				comments: article.comments - 1,
			}),
		]);
	}
}

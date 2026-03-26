import { inject, injectable } from "inversify";
import { ArticleComment } from "../../../../domain/entities/article-comment.entity";
import { ArticleCommentCreatedEvent } from "../../../../domain/events/article-comment-created.event";
import type {
	IArticleCommentRepository,
	IArticleRepository,
	IUserRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { EventBus } from "../../../events/event-bus.interface";
import type { IStorageService } from "../../../services/storage.service.interface";
import type {
	CreateArticleCommentInput,
	CreateArticleCommentOutput,
} from "../dtos/article-input.dto";
import { ArticleCommentNotFoundError, ArticleNotFoundError } from "../errors";
import { ArticleCommentMapper } from "../mappers/article-comment.mapper";
import type { ICreateArticleCommentUseCase } from "./create-article-comment.usecase.interface";

@injectable()
export class CreateArticleCommentUseCase
	implements ICreateArticleCommentUseCase
{
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
		@inject(TYPES.Repositories.ArticleCommentRepository)
		private readonly _commentRepository: IArticleCommentRepository,
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
		@inject(TYPES.Services.EventBus)
		private readonly _eventBus: EventBus,
	) {}

	async execute(
		input: CreateArticleCommentInput,
	): Promise<CreateArticleCommentOutput> {
		const article = await this._articleRepository.findById(input.articleId);
		if (!article || !article.isActive) {
			throw new ArticleNotFoundError();
		}

		let parentId: string | null = null;
		let parentRepliesCount = 0;
		if (input.parentId !== undefined && input.parentId !== null) {
			const parent = await this._commentRepository.findById(input.parentId);
			if (!parent || !parent.isActive) {
				throw new ArticleCommentNotFoundError("Parent comment not found");
			}
			if (parent.articleId !== input.articleId) {
				throw new ArticleCommentNotFoundError(
					"Parent comment does not belong to this article",
				);
			}
			parentId = parent.id;
			parentRepliesCount = parent.repliesCount ?? 0;
		}

		const comment = new ArticleComment(
			"",
			input.articleId,
			parentId,
			input.userId,
			0,
			0,
			input.content,
			true,
			null,
			null,
		);

		const created = await this._commentRepository.create(comment);

		const currentComments = article.commentsCount ?? 0;
		await this._articleRepository.updateById(input.articleId, {
			commentsCount: currentComments + 1,
		});

		if (parentId) {
			await this._commentRepository.updateById(parentId, {
				repliesCount: parentRepliesCount + 1,
			});
		}

		await this._eventBus.publish(
			new ArticleCommentCreatedEvent(
				article.id,
				article.slug,
				article.authorId,
				created.id,
				input.userId,
			),
		);

		const user = await this._userRepository.findById(input.userId);
		const avatarUrl = user?.profilePictureId
			? await this._storageService.getSignedUrl(user.profilePictureId)
			: undefined;

		const authorSnapshot = {
			name: user?.name || "Unknown User",
			avatarUrl,
		};

		return { comment: ArticleCommentMapper.toDto(created, authorSnapshot) };
	}
}

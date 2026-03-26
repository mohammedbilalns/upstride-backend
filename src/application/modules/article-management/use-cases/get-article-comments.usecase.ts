import { inject, injectable } from "inversify";
import type {
	ArticleCommentQuery,
	IArticleCommentRepository,
	IUserRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IStorageService } from "../../../services/storage.service.interface";
import type {
	GetArticleCommentsInput,
	GetArticleCommentsOutput,
} from "../dtos/article-input.dto";
import { ArticleCommentMapper } from "../mappers/article-comment.mapper";
import type { IGetArticleCommentsUseCase } from "./get-article-comments.usecase.interface";

const DEFAULT_PAGE_SIZE = 5;

@injectable()
export class GetArticleCommentsUseCase implements IGetArticleCommentsUseCase {
	constructor(
		@inject(TYPES.Repositories.ArticleCommentRepository)
		private readonly _commentRepository: IArticleCommentRepository,
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute(
		input: GetArticleCommentsInput,
	): Promise<GetArticleCommentsOutput> {
		const query: ArticleCommentQuery = {
			articleId: input.articleId,
			isActive: true,
		};

		if (input.parentId !== undefined) {
			query.parentId = input.parentId ?? null;
		}

		const result = await this._commentRepository.paginate({
			page: input.page,
			limit: DEFAULT_PAGE_SIZE,
			query,
		});

		const items = await Promise.all(
			result.items.map(async (comment) => {
				const user = await this._userRepository.findById(comment.userId);
				const avatarUrl = user?.profilePictureId
					? await this._storageService.getSignedUrl(user.profilePictureId)
					: undefined;

				const authorSnapshot = {
					name: user?.name || "Unknown User",
					avatarUrl,
				};
				return ArticleCommentMapper.toDto(comment, authorSnapshot);
			}),
		);

		return {
			items,
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}

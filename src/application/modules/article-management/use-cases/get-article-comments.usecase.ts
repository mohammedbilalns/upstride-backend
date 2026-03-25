import { inject, injectable } from "inversify";
import type {
	ArticleCommentQuery,
	IArticleCommentRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type {
	GetArticleCommentsInput,
	GetArticleCommentsOutput,
} from "../dtos/article-input.dto";
import { ArticleCommentMapper } from "../mappers/article-comment.mapper";
import type { IGetArticleCommentsUseCase } from "./get-article-comments.usecase.interface";

const DEFAULT_PAGE_SIZE = 6;

@injectable()
export class GetArticleCommentsUseCase implements IGetArticleCommentsUseCase {
	constructor(
		@inject(TYPES.Repositories.ArticleCommentRepository)
		private readonly _commentRepository: IArticleCommentRepository,
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

		return {
			items: ArticleCommentMapper.toDtos(result.items),
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}

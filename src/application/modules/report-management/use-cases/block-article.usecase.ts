import { inject, injectable } from "inversify";
import type {
	IArticleRepository,
	IUserRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { ValidationError } from "../../../shared/errors/validation-error";
import { ArticleNotFoundError } from "../../article-management/errors";
import { ArticleMapper } from "../../article-management/mappers/article.mapper";
import { UserNotFoundError } from "../../authentication/errors";
import type { BlockArticleInput, BlockArticleOutput } from "../dtos/report.dto";
import type { IBlockArticleUseCase } from "./block-article.usecase.interface";

@injectable()
export class BlockArticleUseCase implements IBlockArticleUseCase {
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
	) {}

	async execute(input: BlockArticleInput): Promise<BlockArticleOutput> {
		const admin = await this._userRepository.findById(input.adminId);
		if (!admin) {
			throw new UserNotFoundError();
		}

		if (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN") {
			throw new ValidationError("Only admins can block articles");
		}

		const article = await this._articleRepository.findById(input.articleId);
		if (!article || !article.isActive) {
			throw new ArticleNotFoundError();
		}

		const updated = await this._articleRepository.updateById(input.articleId, {
			isActive: false,
			isArchived: true,
		});

		if (!updated) {
			throw new ArticleNotFoundError();
		}

		return { article: ArticleMapper.toDto(updated) };
	}
}

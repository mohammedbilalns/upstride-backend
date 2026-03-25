import { inject, injectable } from "inversify";
import { Article } from "../../../../domain/entities/article.entity";
import type {
	IArticleRepository,
	IUserRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IStorageService } from "../../../services/storage.service.interface";
import { ValidationError } from "../../../shared/errors/validation-error";
import { createUniqueSlug } from "../../../shared/utilities/slug.util";
import { UserNotFoundError } from "../../authentication/errors";
import type {
	CreateArticleInput,
	CreateArticleOutput,
} from "../dtos/article-input.dto";
import { ArticleMapper } from "../mappers/article.mapper";
import { generatePreviewContent } from "../utils/preview-content";
import type { ICreateArticleUseCase } from "./create-article.usecase.interface";

@injectable()
export class CreateArticleUseCase implements ICreateArticleUseCase {
	constructor(
		@inject(TYPES.Repositories.ArticleRepository)
		private readonly _articleRepository: IArticleRepository,
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute(input: CreateArticleInput): Promise<CreateArticleOutput> {
		const user = await this._userRepository.findById(input.userId);
		if (!user) {
			throw new UserNotFoundError();
		}

		if (user.role !== "MENTOR") {
			throw new ValidationError("Only mentors can create articles");
		}

		const avatarUrl = user.profilePictureId
			? await this._storageService.getSignedUrl(user.profilePictureId)
			: "";

		const previewContent = generatePreviewContent(input.description);
		const slug = await createUniqueSlug(input.title, async (value) => {
			const existing = await this._articleRepository.query({
				query: { slug: value },
			});
			return existing.length === 0;
		});

		const article = new Article(
			"",
			user.id,
			{ name: user.name, avatarUrl },
			slug,
			input.featuredImageUrl,
			input.title,
			input.description,
			previewContent,
			input.tags ?? [],
			true,
			0,
			0,
			false,
			null,
			null,
		);

		const created = await this._articleRepository.create(article);
		return { article: ArticleMapper.toDto(created) };
	}
}

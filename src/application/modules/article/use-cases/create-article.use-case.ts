import { inject, injectable } from "inversify";
import { Article } from "../../../../domain/entities/article.entity";
import type {
	IArticleRepository,
	IUserRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IStorageService } from "../../../services/storage.service.interface";
import { createUniqueSlug } from "../../../shared/utilities/slug.util";
import { UserNotFoundError } from "../../authentication/errors";
import type {
	CreateArticleInput,
	CreateArticleOutput,
} from "../dtos/article-input.dto";
import { MentorOnlyArticleActionError } from "../errors";
import { ArticleMapper } from "../mappers/article.mapper";
import { generatePreviewContent } from "../utils/preview-content";
import type { ICreateArticleUseCase } from "./create-article.use-case.interface";

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
			throw new MentorOnlyArticleActionError("create");
		}

		const avatarUrl = user.profilePictureId
			? this._storageService.getPublicUrl(user.profilePictureId)
			: undefined;

		const previewContent = generatePreviewContent(input.description);
		const slug = await createUniqueSlug(input.title, async (value) => {
			const existing = await this._articleRepository.query({
				query: { slug: value },
			});
			return existing.length === 0;
		});

		const featuredImageUrl = input.featuredImageUrl || "";

		const article = new Article(
			"",
			user.id,
			{ name: user.name, avatarUrl },
			slug,
			featuredImageUrl,
			input.title,
			input.description,
			previewContent,
			input.tags ?? [],
			true,
			0,
			0,
			0,
			false,
			false,
			null,
			null,
			null,
			null,
			null,
		);

		const created = await this._articleRepository.create(article);
		const resultDto = ArticleMapper.toDto(created);

		if (resultDto.featuredImageUrl) {
			resultDto.featuredImageUrl = this._storageService.getPublicUrl(
				resultDto.featuredImageId,
			);
		}
		return { article: resultDto };
	}
}

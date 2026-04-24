import { inject, injectable } from "inversify";
import type { IDashboardRepository } from "../../../../domain/repositories/dashboard.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { IStorageService } from "../../../services/storage.service.interface";
import type {
	DashboardSummaryDto,
	DashboardSummaryInput,
} from "../dtos/dashboard.dto";
import { DashboardMapper } from "../mappers/dashboard.mapper";
import type { IGetDashboardUseCase } from "./get-dashboard.use-case.interface";

@injectable()
export class GetDashboardUseCase implements IGetDashboardUseCase {
	constructor(
		@inject(TYPES.Repositories.DashboardRepository)
		private readonly _dashboardRepository: IDashboardRepository,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute(input: DashboardSummaryInput): Promise<DashboardSummaryDto> {
		const source = await this._dashboardRepository.getDashboardSource({
			userId: input.userId,
			role: input.role,
		});

		const summary = DashboardMapper.toSummaryDto(source);

		summary.recommendedArticles = summary.recommendedArticles.map((article) =>
			this.toPublicArticleImage(article),
		);

		return summary;
	}

	private toPublicArticleImage(
		article: DashboardSummaryDto["recommendedArticles"][number],
	) {
		if (
			!article.featuredImageUrl ||
			article.featuredImageUrl.startsWith("http")
		) {
			return article;
		}

		return {
			...article,
			featuredImageUrl: this._storageService.getPublicUrl(
				article.featuredImageUrl,
			),
		};
	}
}

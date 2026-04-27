import { inject, injectable } from "inversify";
import type { IDashboardRepository } from "../../../../domain/repositories/dashboard.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type {
	DashboardActivityOverviewDto,
	DashboardActivityOverviewInput,
} from "../dtos/dashboard.dto";
import { DashboardMapper } from "../mappers/dashboard.mapper";
import type { IGetDashboardActivityOverviewUseCase } from "./get-dashboard-activity-overview.use-case.interface";

@injectable()
export class GetDashboardActivityOverviewUseCase
	implements IGetDashboardActivityOverviewUseCase
{
	constructor(
		@inject(TYPES.Repositories.DashboardRepository)
		private readonly _dashboardRepository: IDashboardRepository,
	) {}

	async execute(
		input: DashboardActivityOverviewInput,
	): Promise<DashboardActivityOverviewDto> {
		const source = await this._dashboardRepository.getActivityOverviewSource({
			userId: input.userId,
			role: input.role,
			period: input.period,
		});

		return DashboardMapper.toActivityOverviewDto(source, input.period);
	}
}

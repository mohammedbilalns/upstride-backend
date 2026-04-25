import type {
	DashboardActivityOverviewDto,
	DashboardActivityOverviewInput,
} from "../dtos/dashboard.dto";

export interface IGetDashboardActivityOverviewUseCase {
	execute(
		input: DashboardActivityOverviewInput,
	): Promise<DashboardActivityOverviewDto>;
}

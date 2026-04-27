import type {
	AdminDashboardChartInput,
	AdminDashboardUserGrowthDto,
} from "../dtos/admin-dashboard.dto";

export interface IGetAdminDashboardUserGrowthUseCase {
	execute(
		input: AdminDashboardChartInput,
	): Promise<AdminDashboardUserGrowthDto>;
}

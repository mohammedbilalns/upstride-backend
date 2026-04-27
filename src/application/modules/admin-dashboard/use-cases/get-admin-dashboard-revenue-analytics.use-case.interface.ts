import type {
	AdminDashboardChartInput,
	AdminDashboardRevenueAnalyticsDto,
} from "../dtos/admin-dashboard.dto";

export interface IGetAdminDashboardRevenueAnalyticsUseCase {
	execute(
		input: AdminDashboardChartInput,
	): Promise<AdminDashboardRevenueAnalyticsDto>;
}

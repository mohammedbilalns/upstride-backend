import type { AdminDashboardSessionOverviewDto } from "../dtos/admin-dashboard.dto";

export interface IGetAdminDashboardSessionOverviewUseCase {
	execute(): Promise<AdminDashboardSessionOverviewDto>;
}

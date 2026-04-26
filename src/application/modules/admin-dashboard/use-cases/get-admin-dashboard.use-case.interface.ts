import type { AdminDashboardSummaryDto } from "../dtos/admin-dashboard.dto";

export interface IGetAdminDashboardUseCase {
	execute(): Promise<AdminDashboardSummaryDto>;
}

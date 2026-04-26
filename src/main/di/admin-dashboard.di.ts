import type { Container } from "inversify";
import {
	GetAdminDashboardRevenueAnalyticsUseCase,
	GetAdminDashboardSessionOverviewUseCase,
	GetAdminDashboardUseCase,
	GetAdminDashboardUserGrowthUseCase,
	type IGetAdminDashboardRevenueAnalyticsUseCase,
	type IGetAdminDashboardSessionOverviewUseCase,
	type IGetAdminDashboardUseCase,
	type IGetAdminDashboardUserGrowthUseCase,
} from "../../application/modules/admin-dashboard/use-cases";
import { AdminDashboardController } from "../../presentation/http/controllers/admin-dashboard.controller";
import { TYPES } from "../../shared/types/types";

export const registerAdminDashboardBindings = (container: Container): void => {
	container
		.bind<IGetAdminDashboardUseCase>(TYPES.UseCases.GetAdminDashboard)
		.to(GetAdminDashboardUseCase)
		.inSingletonScope();
	container
		.bind<IGetAdminDashboardUserGrowthUseCase>(
			TYPES.UseCases.GetAdminDashboardUserGrowth,
		)
		.to(GetAdminDashboardUserGrowthUseCase)
		.inSingletonScope();
	container
		.bind<IGetAdminDashboardRevenueAnalyticsUseCase>(
			TYPES.UseCases.GetAdminDashboardRevenueAnalytics,
		)
		.to(GetAdminDashboardRevenueAnalyticsUseCase)
		.inSingletonScope();
	container
		.bind<IGetAdminDashboardSessionOverviewUseCase>(
			TYPES.UseCases.GetAdminDashboardSessionOverview,
		)
		.to(GetAdminDashboardSessionOverviewUseCase)
		.inSingletonScope();
	container
		.bind<AdminDashboardController>(TYPES.Controllers.AdminDashboard)
		.to(AdminDashboardController)
		.inSingletonScope();
};

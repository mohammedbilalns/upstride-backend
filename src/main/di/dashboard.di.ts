import type { Container } from "inversify";
import {
	GetDashboardActivityOverviewUseCase,
	GetDashboardUseCase,
	type IGetDashboardActivityOverviewUseCase,
	type IGetDashboardUseCase,
} from "../../application/modules/dashboard/use-cases";
import { DashboardController } from "../../presentation/http/controllers/dashboard.controller";
import { TYPES } from "../../shared/types/types";

export const registerDashboardBindings = (container: Container): void => {
	container
		.bind<IGetDashboardUseCase>(TYPES.UseCases.GetDashboard)
		.to(GetDashboardUseCase)
		.inSingletonScope();
	container
		.bind<IGetDashboardActivityOverviewUseCase>(
			TYPES.UseCases.GetDashboardActivityOverview,
		)
		.to(GetDashboardActivityOverviewUseCase)
		.inSingletonScope();
	container
		.bind<DashboardController>(TYPES.Controllers.Dashboard)
		.to(DashboardController)
		.inSingletonScope();
};

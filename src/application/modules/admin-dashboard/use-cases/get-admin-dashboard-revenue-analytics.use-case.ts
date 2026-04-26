import { inject, injectable } from "inversify";
import type { IAdminDashboardRepository } from "../../../../domain/repositories/admin-dashboard.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type {
	AdminDashboardChartInput,
	AdminDashboardRevenueAnalyticsDto,
} from "../dtos/admin-dashboard.dto";
import { AdminDashboardMapper } from "../mappers/admin-dashboard.mapper";
import type { IGetAdminDashboardRevenueAnalyticsUseCase } from "./get-admin-dashboard-revenue-analytics.use-case.interface";

@injectable()
export class GetAdminDashboardRevenueAnalyticsUseCase
	implements IGetAdminDashboardRevenueAnalyticsUseCase
{
	constructor(
		@inject(TYPES.Repositories.AdminDashboardRepository)
		private readonly _adminDashboardRepository: IAdminDashboardRepository,
	) {}

	async execute(
		input: AdminDashboardChartInput,
	): Promise<AdminDashboardRevenueAnalyticsDto> {
		const source =
			await this._adminDashboardRepository.getRevenueAnalytics(input);
		return AdminDashboardMapper.toRevenueAnalyticsDto(source);
	}
}

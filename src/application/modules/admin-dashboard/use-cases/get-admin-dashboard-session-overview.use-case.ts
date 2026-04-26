import { inject, injectable } from "inversify";
import type { IAdminDashboardRepository } from "../../../../domain/repositories/admin-dashboard.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { AdminDashboardSessionOverviewDto } from "../dtos/admin-dashboard.dto";
import { AdminDashboardMapper } from "../mappers/admin-dashboard.mapper";
import type { IGetAdminDashboardSessionOverviewUseCase } from "./get-admin-dashboard-session-overview.use-case.interface";

@injectable()
export class GetAdminDashboardSessionOverviewUseCase
	implements IGetAdminDashboardSessionOverviewUseCase
{
	constructor(
		@inject(TYPES.Repositories.AdminDashboardRepository)
		private readonly _adminDashboardRepository: IAdminDashboardRepository,
	) {}

	async execute(): Promise<AdminDashboardSessionOverviewDto> {
		const source = await this._adminDashboardRepository.getSessionOverview();
		return AdminDashboardMapper.toSessionOverviewDto(source);
	}
}

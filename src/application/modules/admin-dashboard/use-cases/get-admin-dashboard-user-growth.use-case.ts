import { inject, injectable } from "inversify";
import type { IAdminDashboardRepository } from "../../../../domain/repositories/admin-dashboard.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type {
	AdminDashboardChartInput,
	AdminDashboardUserGrowthDto,
} from "../dtos/admin-dashboard.dto";
import { AdminDashboardMapper } from "../mappers/admin-dashboard.mapper";
import type { IGetAdminDashboardUserGrowthUseCase } from "./get-admin-dashboard-user-growth.use-case.interface";

@injectable()
export class GetAdminDashboardUserGrowthUseCase
	implements IGetAdminDashboardUserGrowthUseCase
{
	constructor(
		@inject(TYPES.Repositories.AdminDashboardRepository)
		private readonly _adminDashboardRepository: IAdminDashboardRepository,
	) {}

	async execute(
		input: AdminDashboardChartInput,
	): Promise<AdminDashboardUserGrowthDto> {
		const source = await this._adminDashboardRepository.getUserGrowth(input);
		return AdminDashboardMapper.toUserGrowthDto(source);
	}
}

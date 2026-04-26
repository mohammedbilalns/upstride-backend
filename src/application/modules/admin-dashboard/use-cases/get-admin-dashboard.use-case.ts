import { inject, injectable } from "inversify";
import type { IAdminDashboardRepository } from "../../../../domain/repositories/admin-dashboard.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { AdminDashboardSummaryDto } from "../dtos/admin-dashboard.dto";
import { AdminDashboardMapper } from "../mappers/admin-dashboard.mapper";
import type { IGetAdminDashboardUseCase } from "./get-admin-dashboard.use-case.interface";

@injectable()
export class GetAdminDashboardUseCase implements IGetAdminDashboardUseCase {
	constructor(
		@inject(TYPES.Repositories.AdminDashboardRepository)
		private readonly _adminDashboardRepository: IAdminDashboardRepository,
	) {}

	async execute(): Promise<AdminDashboardSummaryDto> {
		const source = await this._adminDashboardRepository.getSummary();
		return AdminDashboardMapper.toSummaryDto(source);
	}
}

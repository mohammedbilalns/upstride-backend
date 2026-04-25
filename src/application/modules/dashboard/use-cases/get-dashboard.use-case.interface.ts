import type {
	DashboardSummaryDto,
	DashboardSummaryInput,
} from "../dtos/dashboard.dto";

export interface IGetDashboardUseCase {
	execute(input: DashboardSummaryInput): Promise<DashboardSummaryDto>;
}

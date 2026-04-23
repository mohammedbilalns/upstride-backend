import { inject, injectable } from "inversify";
import type {
	IReportRepository,
	IUserRepository,
	ReportQuery,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { mapPaginatedResult } from "../../../shared/utilities/pagination.util";
import { UserNotFoundError } from "../../authentication/errors";
import type { GetReportsInput, GetReportsOutput } from "../dtos/report.dto";
import { AdminOnlyReportActionError } from "../errors";
import { ReportMapper } from "../mappers/report.mapper";
import type { IGetReportsUseCase } from "./get-reports.use-case.interface";

const DEFAULT_PAGE_SIZE = 20;

@injectable()
export class GetReportsUseCase implements IGetReportsUseCase {
	constructor(
		@inject(TYPES.Repositories.ReportRepository)
		private readonly _reportRepository: IReportRepository,
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
	) {}

	async execute(input: GetReportsInput): Promise<GetReportsOutput> {
		const admin = await this._userRepository.findById(input.adminId);
		if (!admin) {
			throw new UserNotFoundError();
		}

		if (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN") {
			throw new AdminOnlyReportActionError("view reports");
		}

		const query: ReportQuery = {
			...(input.status && { status: input.status }),
			...(input.targetType && { targetType: input.targetType }),
			...(input.targetId && { targetId: input.targetId }),
			...(input.reporterId && { reporterId: input.reporterId }),
			...(typeof input.isAppealSubmitted !== "undefined" && {
				isAppealSubmitted: input.isAppealSubmitted,
			}),
		};

		const [result, stats] = await Promise.all([
			this._reportRepository.paginate({
				page: input.page ?? 1,
				limit: input.limit ?? DEFAULT_PAGE_SIZE,
				query,
				sort: { createdAt: -1 },
			}),
			this._reportRepository.getStats(),
		]);

		const { items, ...meta } = mapPaginatedResult(result, ReportMapper.toDtos);
		return {
			...meta,
			reports: items,
			totalReports: stats.totalReports,
			pendingReports: stats.pendingReports,
			appealedReports: stats.appealedReports,
		};
	}
}

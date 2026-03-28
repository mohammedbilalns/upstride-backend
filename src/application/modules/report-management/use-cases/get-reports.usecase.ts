import { inject, injectable } from "inversify";
import type {
	IReportRepository,
	IUserRepository,
	ReportQuery,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { ValidationError } from "../../../shared/errors/validation-error";
import { UserNotFoundError } from "../../authentication/errors";
import type { GetReportsInput, GetReportsOutput } from "../dtos/report.dto";
import { ReportMapper } from "../mappers/report.mapper";
import type { IGetReportsUseCase } from "./get-reports.usecase.interface";

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
			throw new ValidationError("Only admins can view reports");
		}

		const query: ReportQuery = {
			...(input.status && { status: input.status }),
			...(input.targetType && { targetType: input.targetType }),
			...(input.targetId && { targetId: input.targetId }),
			...(input.reporterId && { reporterId: input.reporterId }),
		};

		const result = await this._reportRepository.paginate({
			page: input.page ?? 1,
			limit: input.limit ?? DEFAULT_PAGE_SIZE,
			query,
			sort: { createdAt: -1 },
		});

		return {
			reports: ReportMapper.toDtos(result.items),
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}

import { inject, injectable } from "inversify";
import type {
	IReportRepository,
	IUserRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { UserNotFoundError } from "../../authentication/errors";
import type { ICreateNotificationUseCase } from "../../notification/use-cases";
import type {
	UpdateReportStatusInput,
	UpdateReportStatusOutput,
} from "../dtos/report.dto";
import { AdminOnlyReportActionError, ReportNotFoundError } from "../errors";
import { ReportMapper } from "../mappers/report.mapper";
import type { IUpdateReportStatusUseCase } from "./update-report-status.use-case.interface";

@injectable()
export class UpdateReportStatusUseCase implements IUpdateReportStatusUseCase {
	constructor(
		@inject(TYPES.Repositories.ReportRepository)
		private readonly _reportRepository: IReportRepository,
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.UseCases.CreateNotification)
		private readonly _createNotificationUseCase: ICreateNotificationUseCase,
	) {}

	async execute(
		input: UpdateReportStatusInput,
	): Promise<UpdateReportStatusOutput> {
		const admin = await this._userRepository.findById(input.adminId);
		if (!admin) {
			throw new UserNotFoundError();
		}

		if (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN") {
			throw new AdminOnlyReportActionError("update report status");
		}

		const existing = await this._reportRepository.findById(input.reportId);
		if (!existing) {
			throw new ReportNotFoundError();
		}

		const updatePayload = existing.updateStatus(
			input.status,
			input.actionTaken,
		);
		const updated = await this._reportRepository.updateById(input.reportId, {
			...updatePayload,
		});

		if (!updated) {
			throw new ReportNotFoundError();
		}

		if (
			existing.status !== updated.status &&
			(updated.status === "RESOLVED" || updated.status === "CLOSED")
		) {
			await this._createNotificationUseCase.execute({
				userId: existing.reporterId,
				title: "Report Update",
				description: `Your report has been ${updated.status.toLowerCase()}.`,
				type: "REPORT",
				event: "REPORT_STATUS_UPDATED",
				relatedEntityId: input.reportId,
				actorId: admin.id,
				metadata: {
					reportId: input.reportId,
					status: updated.status,
				},
				deliveryStatus: { inApp: true },
			});
		}

		return { report: ReportMapper.toDto(updated) };
	}
}

import { inject, injectable } from "inversify";
import { Report } from "../../../../domain/entities/report.entity";
import type {
	IReportRepository,
	IUserRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { UserNotFoundError } from "../../authentication/errors";
import type { ReportUserInput, ReportUserOutput } from "../dtos/report.dto";
import {
	ReportAlreadyExistsError,
	ReporterRoleError,
	ReportSelfError,
} from "../errors";
import { ReportMapper } from "../mappers/report.mapper";
import type { IReportUserUseCase } from "./report-user.usecase.interface";

@injectable()
export class ReportUserUseCase implements IReportUserUseCase {
	constructor(
		@inject(TYPES.Repositories.ReportRepository)
		private readonly _reportRepository: IReportRepository,
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
	) {}

	async execute(input: ReportUserInput): Promise<ReportUserOutput> {
		const [reporter, targetUser] = await Promise.all([
			this._userRepository.findById(input.reporterId),
			this._userRepository.findById(input.targetUserId),
		]);

		if (!reporter) {
			throw new UserNotFoundError();
		}

		if (reporter.role !== "USER" && reporter.role !== "MENTOR") {
			throw new ReporterRoleError("users");
		}

		if (!targetUser) {
			throw new UserNotFoundError("Reported user not found");
		}

		if (input.reporterId === input.targetUserId) {
			throw new ReportSelfError("user");
		}

		const existingReports = await this._reportRepository.query({
			query: {
				targetId: input.targetUserId,
				reporterId: input.reporterId,
				status: "PENDING",
			},
		});

		if (existingReports.length > 0) {
			throw new ReportAlreadyExistsError("user");
		}

		const report = new Report(
			"",
			input.reporterId,
			input.targetUserId,
			"USER",
			input.reason,
			input.description,
			"PENDING",
			"",
			null,
			null,
		);

		const created = await this._reportRepository.create(report);

		return { report: ReportMapper.toDto(created) };
	}
}

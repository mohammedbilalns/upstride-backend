import type { ReportUserInput, ReportUserOutput } from "../dtos/report.dto";

export interface IReportUserUseCase {
	execute(input: ReportUserInput): Promise<ReportUserOutput>;
}

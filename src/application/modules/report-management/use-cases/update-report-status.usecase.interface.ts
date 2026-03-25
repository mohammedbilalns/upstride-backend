import type {
	UpdateReportStatusInput,
	UpdateReportStatusOutput,
} from "../dtos/report.dto";

export interface IUpdateReportStatusUseCase {
	execute(input: UpdateReportStatusInput): Promise<UpdateReportStatusOutput>;
}

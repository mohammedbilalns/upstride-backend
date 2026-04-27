import type {
	ReportArticleInput,
	ReportArticleOutput,
} from "../dtos/report.dto";

export interface IReportArticleUseCase {
	execute(input: ReportArticleInput): Promise<ReportArticleOutput>;
}

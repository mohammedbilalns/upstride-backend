import type { Container } from "inversify";
import {
	BlockArticleUseCase,
	GetReportsUseCase,
	type IBlockArticleUseCase,
	type IGetReportsUseCase,
	type IReportArticleUseCase,
	type IReportUserUseCase,
	type IUpdateReportStatusUseCase,
	ReportArticleUseCase,
	ReportUserUseCase,
	UpdateReportStatusUseCase,
} from "../../application/modules/report-management/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerReportBindings = (container: Container): void => {
	container
		.bind<IReportArticleUseCase>(TYPES.UseCases.ReportArticle)
		.to(ReportArticleUseCase);
	container
		.bind<IReportUserUseCase>(TYPES.UseCases.ReportUser)
		.to(ReportUserUseCase);
	container
		.bind<IGetReportsUseCase>(TYPES.UseCases.GetReports)
		.to(GetReportsUseCase);
	container
		.bind<IUpdateReportStatusUseCase>(TYPES.UseCases.UpdateReportStatus)
		.to(UpdateReportStatusUseCase);
	container
		.bind<IBlockArticleUseCase>(TYPES.UseCases.BlockArticle)
		.to(BlockArticleUseCase);
};

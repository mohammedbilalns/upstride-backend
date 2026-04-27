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
} from "../../application/modules/report/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerReportBindings = (container: Container): void => {
	container
		.bind<IReportArticleUseCase>(TYPES.UseCases.ReportArticle)
		.to(ReportArticleUseCase)
		.inSingletonScope();
	container
		.bind<IReportUserUseCase>(TYPES.UseCases.ReportUser)
		.to(ReportUserUseCase)
		.inSingletonScope();
	container
		.bind<IGetReportsUseCase>(TYPES.UseCases.GetReports)
		.to(GetReportsUseCase)
		.inSingletonScope();
	container
		.bind<IUpdateReportStatusUseCase>(TYPES.UseCases.UpdateReportStatus)
		.to(UpdateReportStatusUseCase)
		.inSingletonScope();
	container
		.bind<IBlockArticleUseCase>(TYPES.UseCases.BlockArticle)
		.to(BlockArticleUseCase)
		.inSingletonScope();
};

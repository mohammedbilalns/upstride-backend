import { inject, injectable } from "inversify";
import type {
	IBlockArticleUseCase,
	IGetReportsUseCase,
	IReportArticleUseCase,
	IReportUserUseCase,
	IUpdateReportStatusUseCase,
} from "../../../application/modules/report-management/use-cases";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { ReportResponseMessages } from "../constants";
import { asyncHandler, sendSuccess } from "../helpers";
import type {
	BlockArticleBody,
	BlockArticleParam,
	GetReportsQuery,
	ReportArticleParam,
	ReportBody,
	ReportIdParam,
	ReportUserParam,
	UpdateReportStatusBody,
} from "../validators/report.validator";

@injectable()
export class ReportController {
	constructor(
		@inject(TYPES.UseCases.ReportArticle)
		private readonly _reportArticleUseCase: IReportArticleUseCase,
		@inject(TYPES.UseCases.ReportUser)
		private readonly _reportUserUseCase: IReportUserUseCase,
		@inject(TYPES.UseCases.GetReports)
		private readonly _getReportsUseCase: IGetReportsUseCase,
		@inject(TYPES.UseCases.UpdateReportStatus)
		private readonly _updateReportStatusUseCase: IUpdateReportStatusUseCase,
		@inject(TYPES.UseCases.BlockArticle)
		private readonly _blockArticleUseCase: IBlockArticleUseCase,
	) {}

	reportArticle = asyncHandler(async (req, res) => {
		const { articleId } = req.validated?.params as ReportArticleParam;
		const { reason, description } = req.validated?.body as ReportBody;
		const reporterId = (req as AuthenticatedRequest).user.id;

		const result = await this._reportArticleUseCase.execute({
			reporterId,
			articleId,
			reason,
			description,
		});

		return sendSuccess(res, HttpStatus.CREATED, {
			message: ReportResponseMessages.REPORT_SUBMITTED_SUCCESS,
			data: result,
		});
	});

	reportUser = asyncHandler(async (req, res) => {
		const { userId: targetUserId } = req.validated?.params as ReportUserParam;
		const { reason, description } = req.validated?.body as ReportBody;
		const reporterId = (req as AuthenticatedRequest).user.id;

		const result = await this._reportUserUseCase.execute({
			reporterId,
			targetUserId,
			reason,
			description,
		});

		return sendSuccess(res, HttpStatus.CREATED, {
			message: ReportResponseMessages.REPORT_SUBMITTED_SUCCESS,
			data: result,
		});
	});

	getReports = asyncHandler(async (req, res) => {
		const adminId = (req as AuthenticatedRequest).user.id;
		const query = req.validated?.query as GetReportsQuery;

		const result = await this._getReportsUseCase.execute({
			adminId,
			page: query.page,
			limit: query.limit,
			status: query.status,
			targetType: query.targetType,
			targetId: query.targetId,
			reporterId: query.reporterId,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: ReportResponseMessages.REPORTS_FETCHED_SUCCESS,
			data: result,
		});
	});

	updateStatus = asyncHandler(async (req, res) => {
		const adminId = (req as AuthenticatedRequest).user.id;
		const { reportId } = req.validated?.params as ReportIdParam;
		const { status, actionTaken } = req.validated
			?.body as UpdateReportStatusBody;

		const result = await this._updateReportStatusUseCase.execute({
			adminId,
			reportId,
			status,
			actionTaken,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: ReportResponseMessages.REPORT_STATUS_UPDATED_SUCCESS,
			data: result,
		});
	});

	blockArticle = asyncHandler(async (req, res) => {
		const adminId = (req as AuthenticatedRequest).user.id;
		const { articleId } = req.validated?.params as BlockArticleParam;
		const { reason } = req.validated?.body as BlockArticleBody;

		const result = await this._blockArticleUseCase.execute({
			adminId,
			articleId,
			reason,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: ReportResponseMessages.ARTICLE_BLOCKED_SUCCESS,
			data: result,
		});
	});
}

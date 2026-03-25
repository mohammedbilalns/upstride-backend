import type {
	ReportStatus,
	ReportTargetType,
} from "../../../../domain/entities/report.entity";
import type { ArticleDto } from "../../article-management/dtos/article.dto";

export interface ReportDto {
	id: string;
	reporterId: string;
	targetId: string;
	targetType: ReportTargetType;
	reason: string;
	description: string;
	status: ReportStatus;
	actionTaken: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ReportArticleInput {
	reporterId: string;
	articleId: string;
	reason: string;
	description: string;
}

export interface ReportArticleOutput {
	report: ReportDto;
}

export interface ReportUserInput {
	reporterId: string;
	targetUserId: string;
	reason: string;
	description: string;
}

export interface ReportUserOutput {
	report: ReportDto;
}

export interface GetReportsInput {
	adminId: string;
	page?: number;
	limit?: number;
	status?: ReportStatus | ReportStatus[];
	targetType?: ReportTargetType | ReportTargetType[];
	targetId?: string;
	reporterId?: string;
}

export interface GetReportsOutput {
	reports: ReportDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export type ReportDecisionStatus = "RESOLVED" | "REJECTED";

export interface UpdateReportStatusInput {
	adminId: string;
	reportId: string;
	status: ReportDecisionStatus;
	actionTaken?: string;
}

export interface UpdateReportStatusOutput {
	report: ReportDto;
}

export interface BlockArticleInput {
	adminId: string;
	articleId: string;
}

export interface BlockArticleOutput {
	article: ArticleDto;
}

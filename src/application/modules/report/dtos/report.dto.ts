import type {
	ReportStatus,
	ReportTargetType,
} from "../../../../domain/entities/report.entity";
import type { ArticleDto } from "../../article/dtos/article.dto";

export interface ReportDto {
	id: string;
	reporterId: string;
	targetId: string;
	targetType: ReportTargetType;
	reason: string;
	description: string;
	status: ReportStatus;
	reporter?: { id: string; name: string; email: string };
	target?: {
		id: string;
		name?: string;
		email?: string;
		title?: string;
		slug?: string;
		isBlocked?: boolean;
	};
	targetSlug?: string;
	actionTaken: string;
	appealMessage: string | null;
	appealedAt: Date | null;
	isAppealSubmitted: boolean;
	createdAt: Date;
	updatedAt: Date;
	actionTakenAt: Date | null;
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
	isAppealSubmitted?: boolean;
}

export interface GetReportsOutput {
	reports: ReportDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	totalReports: number;
	pendingReports: number;
	appealedReports: number;
}

export type ReportDecisionStatus = "RESOLVED" | "REJECTED" | "CLOSED";

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
	reason: string;
	reportId?: string;
}

export interface BlockArticleOutput {
	resourceId: string;
	article: ArticleDto;
}

import { z } from "zod";
import {
	ReportStatusValues,
	ReportTargetTypeValues,
} from "../../../domain/entities/report.entity";
import {
	limitSchema,
	objectIdSchema,
	pageSchema,
} from "../../../shared/validators";

const reportReasonSchema = z
	.string()
	.trim()
	.min(3, "Reason must be at least 3 characters");

const reportDescriptionSchema = z
	.string()
	.trim()
	.min(10, "Description must be at least 10 characters");

export const ReportBodySchema = z.object({
	reason: reportReasonSchema,
	description: reportDescriptionSchema,
});

export type ReportBody = z.infer<typeof ReportBodySchema>;

export const ReportArticleParamSchema = z.object({
	articleId: objectIdSchema,
});

export type ReportArticleParam = z.infer<typeof ReportArticleParamSchema>;

export const ReportUserParamSchema = z.object({
	userId: objectIdSchema,
});

export type ReportUserParam = z.infer<typeof ReportUserParamSchema>;

export const ReportIdParamSchema = z.object({
	reportId: objectIdSchema,
});

export type ReportIdParam = z.infer<typeof ReportIdParamSchema>;

export const BlockArticleParamSchema = z.object({
	articleId: objectIdSchema,
});

export type BlockArticleParam = z.infer<typeof BlockArticleParamSchema>;

const reportStatusFilterSchema = z.union([
	z.enum(ReportStatusValues),
	z.array(z.enum(ReportStatusValues)).min(1),
]);

const reportTargetTypeFilterSchema = z.union([
	z.enum(ReportTargetTypeValues),
	z.array(z.enum(ReportTargetTypeValues)).min(1),
]);

export const GetReportsQuerySchema = z.object({
	page: pageSchema,
	limit: limitSchema,
	status: reportStatusFilterSchema.optional(),
	targetType: reportTargetTypeFilterSchema.optional(),
	targetId: objectIdSchema.optional(),
	reporterId: objectIdSchema.optional(),
	isAppealSubmitted: z
		.enum(["true", "false"])
		.transform((val) => val === "true")
		.optional(),
});

export type GetReportsQuery = z.infer<typeof GetReportsQuerySchema>;

export const UpdateReportStatusBodySchema = z.object({
	status: z.enum(["RESOLVED", "REJECTED", "CLOSED"]),
	actionTaken: z
		.string()
		.trim()
		.min(3, "Action taken must be at least 3 characters")
		.optional(),
});

export type UpdateReportStatusBody = z.infer<
	typeof UpdateReportStatusBodySchema
>;

export const BlockArticleBodySchema = z.object({
	reason: reportReasonSchema,
	reportId: objectIdSchema.optional(),
});

export type BlockArticleBody = z.infer<typeof BlockArticleBodySchema>;

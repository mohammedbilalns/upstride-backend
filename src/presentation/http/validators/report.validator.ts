import { z } from "zod";
import {
	ReportStatusValues,
	ReportTargetTypeValues,
} from "../../../domain/entities/report.entity";
import {
	buildObjectIdParamSchema,
	limitSchema,
	objectIdSchema,
	pageSchema,
} from "../../../shared/validators";

const ReportReasonSchema = z
	.string()
	.trim()
	.min(3, "Reason must be at least 3 characters");

const ReportDescriptionSchema = z
	.string()
	.trim()
	.min(10, "Description must be at least 10 characters");

export const ReportBodySchema = z.object({
	reason: ReportReasonSchema,
	description: ReportDescriptionSchema,
});

export type ReportBody = z.infer<typeof ReportBodySchema>;

export const ReportArticleParamSchema = buildObjectIdParamSchema("articleId");

export type ReportArticleParam = z.infer<typeof ReportArticleParamSchema>;

export const ReportUserParamSchema = buildObjectIdParamSchema("userId");

export type ReportUserParam = z.infer<typeof ReportUserParamSchema>;

export const ReportIdParamSchema = buildObjectIdParamSchema("reportId");

export type ReportIdParam = z.infer<typeof ReportIdParamSchema>;

export const BlockArticleParamSchema = buildObjectIdParamSchema("articleId");

export type BlockArticleParam = z.infer<typeof BlockArticleParamSchema>;

const ReportStatusFilterSchema = z.union([
	z.enum(ReportStatusValues),
	z.array(z.enum(ReportStatusValues)).min(1),
]);

const ReportTargetTypeFilterSchema = z.union([
	z.enum(ReportTargetTypeValues),
	z.array(z.enum(ReportTargetTypeValues)).min(1),
]);

export const GetReportsQuerySchema = z.object({
	page: pageSchema,
	limit: limitSchema,
	status: ReportStatusFilterSchema.optional(),
	targetType: ReportTargetTypeFilterSchema.optional(),
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
	reason: ReportReasonSchema,
	reportId: objectIdSchema.optional(),
});

export type BlockArticleBody = z.infer<typeof BlockArticleBodySchema>;

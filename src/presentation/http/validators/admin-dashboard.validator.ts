import { z } from "zod";

export const AdminDashboardChartQuerySchema = z
	.object({
		period: z.enum(["week", "month", "year", "custom"]).default("month"),
		startDate: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, "startDate must be YYYY-MM-DD")
			.optional(),
		endDate: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, "endDate must be YYYY-MM-DD")
			.optional(),
	})
	.superRefine((value, ctx) => {
		if (value.period !== "custom") {
			return;
		}

		if (!value.startDate || !value.endDate) {
			ctx.addIssue({
				code: "custom",
				message: "startDate and endDate are required for custom period",
				path: ["startDate"],
			});
			return;
		}

		if (value.startDate > value.endDate) {
			ctx.addIssue({
				code: "custom",
				message: "startDate must be before or equal to endDate",
				path: ["startDate"],
			});
		}
	});

export type AdminDashboardChartQuery = z.infer<
	typeof AdminDashboardChartQuerySchema
>;

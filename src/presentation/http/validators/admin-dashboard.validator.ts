import { z } from "zod";

const parseIsoDate = (value: string) => new Date(`${value}T00:00:00.000Z`);

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

		const startDate = parseIsoDate(value.startDate);
		const endDate = parseIsoDate(value.endDate);
		const today = new Date();
		today.setUTCHours(0, 0, 0, 0);

		if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
			ctx.addIssue({
				code: "custom",
				message: "Invalid custom date range",
				path: ["startDate"],
			});
			return;
		}

		if (startDate > today || endDate > today) {
			ctx.addIssue({
				code: "custom",
				message: "Custom date range cannot include future dates",
				path: ["endDate"],
			});
		}

		if (startDate > endDate) {
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

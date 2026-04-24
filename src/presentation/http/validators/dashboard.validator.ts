import { z } from "zod";

export const DashboardActivityOverviewQuerySchema = z.object({
	period: z.enum(["week", "month", "year"]).default("month"),
});

export type DashboardActivityOverviewQuery = z.infer<
	typeof DashboardActivityOverviewQuerySchema
>;

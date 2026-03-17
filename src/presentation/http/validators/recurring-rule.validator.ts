import { z } from "zod";

const allowedDurationSchema = z.union([z.literal(30), z.literal(60)]);

export const ruleIdParamSchema = z.object({
	ruleId: z.string().min(1, "Rule id is required"),
});

export const addRecurringRuleBodySchema = z
	.object({
		rule: z.object({
			weekDay: z.coerce.number().int().min(0).max(6),
			startTime: z.coerce.number().int().min(0),
			endTime: z.coerce.number().int().min(0),
			slotDuration: allowedDurationSchema,
		}),
	})
	.refine((input) => input.rule.endTime > input.rule.startTime, {
		message: "End time must be after start time",
		path: ["rule", "endTime"],
	});

export const updateRecurringRuleBodySchema = z
	.object({
		updates: z
			.object({
				weekDay: z.coerce.number().int().min(0).max(6).optional(),
				startTime: z.coerce.number().int().min(0).optional(),
				endTime: z.coerce.number().int().min(0).optional(),
				slotDuration: allowedDurationSchema.optional(),
				isActive: z.boolean().optional(),
			})
			.refine(
				(values) =>
					values.startTime === undefined ||
					values.endTime === undefined ||
					values.endTime > values.startTime,
				{
					message: "End time must be after start time",
					path: ["endTime"],
				},
			),
	})
	.refine((input) => Object.keys(input.updates).length > 0, {
		message: "At least one update field is required",
		path: ["updates"],
	});

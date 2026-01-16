import z from "zod";

const rule = z.object({
	weekDay: z.number().int().min(1).max(7),
	startTime: z.string().regex(/^\d{2}:\d{2}$/),
	endTime: z.string().regex(/^\d{2}:\d{2}$/),
	slotDuration: z.union([
		z.literal(30),
		z.literal(60),
		z.literal(90),
	]),
	price: z
		.number()
		.min(10, "Price must be at least 10")
		.max(10000, "Price cannot exceed 10000")
		.optional(),
});

// create recurring rules
export const createRecurringRuleParamsSchema = z.object({
	mentorId: z.string(),
});

export const createRecurringRulePayloadSchema = z.object({
	rules: z.array(rule),
});

export const addRecurringRulePayloadSchema = rule;


//  update recurring rule
export const updateRecurringRuleParmsSchema = z.object({
	ruleId: z.string(),
});

export const deleteRecurringRuleParamsSchema = z.object({
	ruleId: z.string(),
	deleteSlots: z.enum(["true", "false"]).optional(),
});

export const updateRecurringRulePayloadSchema = rule.partial().extend({
	invalidateExisting: z.boolean().optional(),
});

// disable recurring rule
export const toggleRecurringRuleParmsSchema = z.object({
	ruleId: z.string(),
});

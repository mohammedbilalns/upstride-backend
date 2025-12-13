import z from "zod";

const rule = z.object({
	weekDay: z.number().int().min(1).max(7),
	startTime: z.string().regex(/^\d{2}:\d{2}$/),
	endTime: z.string().regex(/^\d{2}:\d{2}$/),
	slotDuration: z.union([
		z.literal(60),
		z.literal(90),
		z.literal(120),
		z.literal(180),
	]),
});

// create recurring rules
export const createRecurringRuleParamsSchema = z.object({
	mentorId: z.string(),
});

export const createRecurringRulePayloadSchema = z.object({
	rules: z.array(rule),
});

export const addRecurringRulePayloadSchema = z.object({
	rule,
});

//  update recurring rule
export const updateRecurringRuleParmsSchema = z.object({
	ruleId: z.string(),
});

export const deleteRecurringRuleParamsSchema = z.object({
	ruleId: z.string(),
});

export const updateRecurringRulePayloadSchema = rule.partial();

// disable recurring rule
export const disableRecurringRuleParmsSchema = z.object({
	ruleId: z.string(),
});

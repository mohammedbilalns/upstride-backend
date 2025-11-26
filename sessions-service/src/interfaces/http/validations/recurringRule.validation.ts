import z from "zod";

const rule = z.object({
	weekDay: z.number(),
	startTime: z.date(),
	endTime: z.date(),
	slotDuration: z.number(),
});

// create recurring rules
export const createRecurringRuleParamsSchema = z.object({
	mentorId: z.string(),
});

export const createRecurringRulePayloadSchema = z.object({
	rules: z.array(rule),
});

// add recurring rule
export const addRecurringRuleParamsSchema = z.object({
	mentorId: z.string(),
});

export const addRecurringRulePayloadSchema = rule;

//  update recurring rule
export const updateRecurringRuleParmsSchema = z.object({
	mentorId: z.string(),
	ruleId: z.string(),
});

export const updateRecurringRulePayloadSchema = rule.partial();

// disable recurring rule
export const disableRecurringRuleParmsSchema = z.object({
	mentorId: z.string(),
	ruleId: z.string(),
});

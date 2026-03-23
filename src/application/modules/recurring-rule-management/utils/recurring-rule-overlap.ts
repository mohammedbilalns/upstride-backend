import type { AvailabilityRule } from "../../../../domain/entities/session-availability.entity";

export const hasRecurringRuleOverlap = (
	rules: AvailabilityRule[],
	target: AvailabilityRule,
	ignoreRuleId?: string,
): boolean =>
	rules.some(
		(existing) =>
			existing.ruleId !== ignoreRuleId &&
			(existing.isActive ?? true) &&
			(target.isActive ?? true) &&
			existing.weekDay === target.weekDay &&
			target.startTime < existing.endTime &&
			target.endTime > existing.startTime,
	);

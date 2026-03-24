import type {
	AllowedDuration,
	AvailabilityRule,
} from "../../../../domain/entities/session-availability.entity";

export interface AddRecurringRuleInput {
	userId: string;
	rule: {
		weekDay: number;
		startTime: number;
		endTime: number;
		slotDuration: AllowedDuration;
	};
}

export interface AddRecurringRuleResponse {
	rule: AvailabilityRule;
}

export interface UpdateRecurringRuleInput {
	userId: string;
	ruleId: string;
	updates: {
		weekDay?: number;
		startTime?: number;
		endTime?: number;
		slotDuration?: AllowedDuration;
		isActive?: boolean;
	};
}

export interface UpdateRecurringRuleResponse {
	rule: AvailabilityRule;
}

export interface ToggleRecurringRuleInput {
	userId: string;
	ruleId: string;
}

export interface ToggleRecurringRuleResponse {
	rule: AvailabilityRule;
}

export interface DeleteRecurringRuleInput {
	userId: string;
	ruleId: string;
}

export interface DeleteRecurringRuleResponse {
	ruleId: string;
}

export interface GetRecurringRulesInput {
	userId: string;
}

export interface GetRecurringRulesResponse {
	rules: AvailabilityRule[];
}

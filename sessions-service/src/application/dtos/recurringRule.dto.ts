import { Availability } from "../../domain/entities/availability.entity";

type Rule = {
	weekDay: number;
	startTime: string;
	endTime: string;
	slotDuration: 60 | 90 | 120 | 180;
	price: number;
};

export interface CreateRecurringRuleDto {
	mentorId: string;
	rules: Array<Rule>;
}

export interface UpdateRecurringRuleDto {
	mentorId: string;
	ruleId: string;
	rule: Partial<Rule>;
	invalidateExisting?: boolean;
}

export interface AddRecurringRuleDto {
	mentorId: string;
	rule: Rule;
}

export interface DisableRecurringRuleDto {
	mentorId: string;
	ruleId: string;
}
export interface EnableRecurringRuleDto {
	mentorId: string;
	ruleId: string;
}

export interface DeleteRecurringRuleDto {
	mentorId: string;
	ruleId: string;
	deleteSlots?: boolean;
}

export type GetMentorRuleResponse = Availability | null;

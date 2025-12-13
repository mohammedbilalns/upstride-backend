import { Availability } from "../../domain/entities/availability.entity";

type Rule = {
	weekDay: number;
	startTime: string;
	endTime: string;
	slotDuration: 60 | 90 | 120 | 180;
};

export interface createRecurringRuleDto {
	mentorId: string;
	rules: Array<Rule>;
}

export interface updateRecurringRuleDto {
	mentorId: string;
	ruleId: string;
	rule: Partial<Rule>;
}

export interface addRecurringRuleDto {
	mentorId: string;
	rule: Rule;
}

export interface disableRecurringRuleDto {
	mentorId: string;
	ruleId: string;
}
export interface enableRecurringRuleDto {
	mentorId: string;
	ruleId: string;
}

export interface deleteRecurringRuleDto {
	mentorId: string;
	ruleId: string;
}

export type getMentorRuleResponse = Availability | null;

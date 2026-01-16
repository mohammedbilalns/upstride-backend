import { Availability } from "../../domain/entities/availability.entity";
import type { AllowedDuration } from "./pricing-config.dto";

type Rule = {
	weekDay: number;
	startTime: string;
	endTime: string;
	slotDuration: AllowedDuration;
};

export interface CreateRecurringRuleDto {
	mentorId: string;
	rules: Array<Rule>;
}

export interface UpdateRecurringRuleDto {
	mentorId: string;
	ruleId: string;
	startTime?: string;
	endTime?: string;
	slotDuration?: AllowedDuration;
	weekDay?: number;
	invalidateExisting?: boolean;
}

export interface AddRecurringRuleDto {
	mentorId: string;
	weekDay: number;
	startTime: string;
	endTime: string;
	slotDuration: AllowedDuration;
}

export interface DisableRecurringRuleDto {
	mentorId: string;
	ruleId: string;
}

export interface EnableRecurringRuleDto {
	mentorId: string;
	ruleId: string;
}

export interface ToggleRecurringRuleDto {
	ruleId: string;
	isActive: boolean;
}

export interface DeleteRecurringRuleDto {
	mentorId: string;
	ruleId: string;
	deleteSlots?: boolean;
}

export type GetMentorRuleResponse = Availability | null;

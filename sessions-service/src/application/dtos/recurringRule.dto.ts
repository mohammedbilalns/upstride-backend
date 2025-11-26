type Rule = {
	weekDay: number;
	startTime: Date;
	endTime: Date;
	slotDuration: number;
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

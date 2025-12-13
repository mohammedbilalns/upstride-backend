import { enableRecurringRuleDto } from "../../../application/dtos/recurringRule.dto";

export interface IEnableRecurringRuleUC {
	execute(dto: enableRecurringRuleDto): Promise<void>;
}

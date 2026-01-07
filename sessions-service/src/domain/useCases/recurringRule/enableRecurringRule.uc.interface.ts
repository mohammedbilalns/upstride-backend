import { EnableRecurringRuleDto } from "../../../application/dtos/recurringRule.dto";

export interface IEnableRecurringRuleUC {
	execute(dto: EnableRecurringRuleDto): Promise<void>;
}

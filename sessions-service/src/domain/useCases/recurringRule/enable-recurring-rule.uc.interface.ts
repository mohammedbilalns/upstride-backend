import { EnableRecurringRuleDto } from "../../../application/dtos/recurring-rule.dto";

export interface IEnableRecurringRuleUC {
	execute(dto: EnableRecurringRuleDto): Promise<void>;
}

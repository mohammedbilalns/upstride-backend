import { DisableRecurringRuleDto } from "../../../application/dtos/recurring-rule.dto";

export interface IDisableRecurringRuleUC {
	execute(dto: DisableRecurringRuleDto): Promise<void>;
}

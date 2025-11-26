import { disableRecurringRuleDto } from "../../../application/dtos/recurringRule.dto";

export interface IDisableRecurringRuleUC {
	execute(dto: disableRecurringRuleDto): Promise<void>;
}

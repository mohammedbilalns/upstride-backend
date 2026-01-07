import { DisableRecurringRuleDto } from "../../../application/dtos/recurringRule.dto";

export interface IDisableRecurringRuleUC {
	execute(dto: DisableRecurringRuleDto): Promise<void>;
}

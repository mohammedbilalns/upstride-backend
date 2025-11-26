import { updateRecurringRuleDto } from "../../../application/dtos/recurringRule.dto";

export interface IUpdateRecurringRuleUC {
	execute(dto: updateRecurringRuleDto): Promise<void>;
}

import { UpdateRecurringRuleDto } from "../../../application/dtos/recurringRule.dto";

export interface IUpdateRecurringRuleUC {
	execute(dto: UpdateRecurringRuleDto): Promise<void>;
}

import { UpdateRecurringRuleDto } from "../../../application/dtos/recurring-rule.dto";

export interface IUpdateRecurringRuleUC {
	execute(dto: UpdateRecurringRuleDto): Promise<void>;
}

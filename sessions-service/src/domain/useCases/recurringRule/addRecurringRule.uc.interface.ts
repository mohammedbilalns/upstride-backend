import { addRecurringRuleDto } from "../../../application/dtos/recurringRule.dto";

export interface IAddRecurringRuleUC {
	execute(dto: addRecurringRuleDto): Promise<void>;
}

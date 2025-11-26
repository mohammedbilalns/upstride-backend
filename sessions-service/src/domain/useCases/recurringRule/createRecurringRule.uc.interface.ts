import { createRecurringRuleDto } from "../../../application/dtos/recurringRule.dto";

export interface ICreateRecurringRuleUC {
	execute(dto: createRecurringRuleDto): Promise<void>;
}

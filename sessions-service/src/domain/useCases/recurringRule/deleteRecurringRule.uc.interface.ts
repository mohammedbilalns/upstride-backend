import { DeleteRecurringRuleDto } from "../../../application/dtos/recurringRule.dto";

export interface IDeleteRecurringRuleUC {
	execute(dto: DeleteRecurringRuleDto): Promise<void>;
}

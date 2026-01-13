import { DeleteRecurringRuleDto } from "../../../application/dtos/recurring-rule.dto";

export interface IDeleteRecurringRuleUC {
	execute(dto: DeleteRecurringRuleDto): Promise<void>;
}

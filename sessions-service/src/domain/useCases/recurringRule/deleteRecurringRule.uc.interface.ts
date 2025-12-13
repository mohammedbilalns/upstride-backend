import { deleteRecurringRuleDto } from "../../../application/dtos/recurringRule.dto";

export interface IDeleteRecurringRuleUC {
	execute(dto: deleteRecurringRuleDto): Promise<void>;
}

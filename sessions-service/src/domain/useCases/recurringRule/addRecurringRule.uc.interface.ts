import { AddRecurringRuleDto } from "../../../application/dtos/recurringRule.dto";

export interface IAddRecurringRuleUC {
	execute(dto: AddRecurringRuleDto): Promise<void>;
}

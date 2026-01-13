import { AddRecurringRuleDto } from "../../../application/dtos/recurring-rule.dto";

export interface IAddRecurringRuleUC {
	execute(dto: AddRecurringRuleDto): Promise<void>;
}

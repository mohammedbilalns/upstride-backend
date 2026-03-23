import type {
	UpdateRecurringRuleInput,
	UpdateRecurringRuleResponse,
} from "../dtos/recurring-rules.dto";

export interface IUpdateRecurringRuleUseCase {
	execute(
		input: UpdateRecurringRuleInput,
	): Promise<UpdateRecurringRuleResponse>;
}

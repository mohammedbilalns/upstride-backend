import type {
	DeleteRecurringRuleInput,
	DeleteRecurringRuleResponse,
} from "../dtos/recurring-rules.dto";

export interface IDeleteRecurringRuleUseCase {
	execute(
		input: DeleteRecurringRuleInput,
	): Promise<DeleteRecurringRuleResponse>;
}

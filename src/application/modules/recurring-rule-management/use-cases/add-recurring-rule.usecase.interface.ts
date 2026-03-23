import type {
	AddRecurringRuleInput,
	AddRecurringRuleResponse,
} from "../dtos/recurring-rules.dto";

export interface IAddRecurringRuleUseCase {
	execute(input: AddRecurringRuleInput): Promise<AddRecurringRuleResponse>;
}

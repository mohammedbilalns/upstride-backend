import type {
	ToggleRecurringRuleInput,
	ToggleRecurringRuleResponse,
} from "../dtos/recurring-rules.dto";

export interface IDisableRecurringRuleUseCase {
	execute(
		input: ToggleRecurringRuleInput,
	): Promise<ToggleRecurringRuleResponse>;
}

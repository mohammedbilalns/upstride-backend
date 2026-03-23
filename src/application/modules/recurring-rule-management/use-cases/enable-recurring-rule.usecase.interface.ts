import type {
	ToggleRecurringRuleInput,
	ToggleRecurringRuleResponse,
} from "../dtos/recurring-rules.dto";

export interface IEnableRecurringRuleUseCase {
	execute(
		input: ToggleRecurringRuleInput,
	): Promise<ToggleRecurringRuleResponse>;
}

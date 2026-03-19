import type {
	GetRecurringRulesInput,
	GetRecurringRulesResponse,
} from "../dtos/recurring-rules.dto";

export interface IGetRecurringRulesUseCase {
	execute(input: GetRecurringRulesInput): Promise<GetRecurringRulesResponse>;
}

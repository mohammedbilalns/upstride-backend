import type { Container } from "inversify";
import {
	AddRecurringRuleUseCase,
	DeleteRecurringRuleUseCase,
	DisableRecurringRuleUseCase,
	EnableRecurringRuleUseCase,
	GetRecurringRulesUseCase,
	type IAddRecurringRuleUseCase,
	type IDeleteRecurringRuleUseCase,
	type IDisableRecurringRuleUseCase,
	type IEnableRecurringRuleUseCase,
	type IGetRecurringRulesUseCase,
	type IUpdateRecurringRuleUseCase,
	UpdateRecurringRuleUseCase,
} from "../../application/modules/recurring-rule-management/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerRecurringRuleBindings = (container: Container): void => {
	container
		.bind<IAddRecurringRuleUseCase>(TYPES.UseCases.AddRecurringRule)
		.to(AddRecurringRuleUseCase);
	container
		.bind<IDeleteRecurringRuleUseCase>(TYPES.UseCases.DeleteRecurringRule)
		.to(DeleteRecurringRuleUseCase);
	container
		.bind<IDisableRecurringRuleUseCase>(TYPES.UseCases.DisableRecurringRule)
		.to(DisableRecurringRuleUseCase);
	container
		.bind<IEnableRecurringRuleUseCase>(TYPES.UseCases.EnableRecurringRule)
		.to(EnableRecurringRuleUseCase);
	container
		.bind<IGetRecurringRulesUseCase>(TYPES.UseCases.GetRecurringRules)
		.to(GetRecurringRulesUseCase);
	container
		.bind<IUpdateRecurringRuleUseCase>(TYPES.UseCases.UpdateRecurringRule)
		.to(UpdateRecurringRuleUseCase);
};

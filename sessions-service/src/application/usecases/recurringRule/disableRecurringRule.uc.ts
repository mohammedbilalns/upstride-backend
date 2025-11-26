import { IDisableRecurringRuleUC } from "../../../domain/useCases/recurringRule/disableRecurringRule.uc.interface";
import { disableRecurringRuleDto } from "../../dtos/recurringRule.dto";

export class DisableRecurringRuleUC implements IDisableRecurringRuleUC {
	async execute(dto: disableRecurringRuleDto): Promise<void> {
		console.log(dto);
		//TODO: implement
	}
}

import { IUpdateRecurringRuleUC } from "../../../domain/useCases/recurringRule/updateRecurringRule.uc.interface";
import { updateRecurringRuleDto } from "../../dtos/recurringRule.dto";

export class UpdateRecurringRuleUC implements IUpdateRecurringRuleUC {
	async execute(dto: updateRecurringRuleDto): Promise<void> {
		console.log(dto);
		//TODO: implement
	}
}

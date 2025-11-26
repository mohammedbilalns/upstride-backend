import { ICreateRecurringRuleUC } from "../../../domain/useCases/recurringRule/createRecurringRule.uc.interface";
import { createRecurringRuleDto } from "../../dtos/recurringRule.dto";

export class CreateRecurringRuleUC implements ICreateRecurringRuleUC {
	async execute(dto: createRecurringRuleDto): Promise<void> {
		console.log(dto);
		//TODO: implement
	}
}

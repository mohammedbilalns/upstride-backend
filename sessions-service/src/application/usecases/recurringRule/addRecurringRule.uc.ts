import { IAddRecurringRuleUC } from "../../../domain/useCases/recurringRule/addRecurringRule.uc.interface";
import { addRecurringRuleDto } from "../../dtos/recurringRule.dto";

export class AddRecurringRuleUC implements IAddRecurringRuleUC {
	async execute(dto: addRecurringRuleDto): Promise<void> {
		console.log(dto);
		//TODO: implement
	}
}

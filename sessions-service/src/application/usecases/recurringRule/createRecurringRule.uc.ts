import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { ICreateRecurringRuleUC } from "../../../domain/useCases/recurringRule/createRecurringRule.uc.interface";
import { createRecurringRuleDto } from "../../dtos/recurringRule.dto";
import { v4 as uuid } from "uuid";

export class CreateRecurringRuleUC implements ICreateRecurringRuleUC {
	constructor(private _availabilityRepository: IAvailabilityRepository) {}

	async execute(dto: createRecurringRuleDto): Promise<void> {
		const { mentorId, rules } = dto;
		// TODO: validate mentor
		const mappedRules = rules.map((rule) => ({ ...rule, ruleId: uuid() }));
		await this._availabilityRepository.create({
			mentorId,
			recurringRules: mappedRules,
		});
	}
}

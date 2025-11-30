import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { IGetRulesUC } from "../../../domain/useCases/recurringRule/getRule.uc.interface";
import { getMentorRuleResponse } from "../../dtos/recurringRule.dto";
import { getMentorRule } from "../../dtos/slot.dto";

export class GetRuleUC implements IGetRulesUC {
	constructor(private _availabilityRepository: IAvailabilityRepository) {}

	async execute(dto: getMentorRule): Promise<getMentorRuleResponse> {
		const { mentorId } = dto;
		const recurringRule =
			await this._availabilityRepository.findByMentorId(mentorId);
		if (!recurringRule) {
			return null;
		}
		return recurringRule;
	}
}

import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { IGetRulesUC } from "../../../domain/useCases/recurringRule/getRule.uc.interface";
import { GetMentorRuleResponse } from "../../dtos/recurringRule.dto";
import { GetMentorRule } from "../../dtos/slot.dto";

export class GetRuleUC implements IGetRulesUC {
	constructor(private _availabilityRepository: IAvailabilityRepository) {}

	async execute(dto: GetMentorRule): Promise<GetMentorRuleResponse> {
		const recurringRule = await this._availabilityRepository.findByMentorId(
			dto.mentorId,
		);
		if (!recurringRule) {
			return null;
		}
		return recurringRule;
	}
}

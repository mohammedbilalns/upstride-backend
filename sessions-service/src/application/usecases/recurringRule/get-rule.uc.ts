import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { IGetRulesUC } from "../../../domain/useCases/recurringRule/get-rule.uc.interface";
import { GetMentorRuleResponse } from "../../dtos/recurring-rule.dto";
import { GetMentorRule } from "../../dtos/slot.dto";

export class GetRuleUC implements IGetRulesUC {
	constructor(private _availabilityRepository: IAvailabilityRepository) { }

	/**
	 * Retrieves recurring availability rules for a mentor.
	 */
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

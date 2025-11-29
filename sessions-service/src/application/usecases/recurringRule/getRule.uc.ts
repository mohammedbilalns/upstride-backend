import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { Availability } from "../../../domain/entities/availability.entity";
import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { IGetRulesUC } from "../../../domain/useCases/recurringRule/getRule.uc.interface";
import { getMentorRule } from "../../dtos/slot.dto";
import { AppError } from "../../errors/AppError";

export class GetRuleUC implements IGetRulesUC {
	constructor(private _availabilityRepository: IAvailabilityRepository) {}

	async execute(dto: getMentorRule): Promise<Availability> {
		const { mentorId } = dto;
		const recurringRule =
			await this._availabilityRepository.findByMentorId(mentorId);
		if (!recurringRule)
			throw new AppError(ErrorMessage.NO_RULES_CONFIGURED, HttpStatus.OK);
		return recurringRule;
	}
}

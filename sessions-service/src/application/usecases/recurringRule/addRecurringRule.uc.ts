import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { IAddRecurringRuleUC } from "../../../domain/useCases/recurringRule/addRecurringRule.uc.interface";
import { addRecurringRuleDto } from "../../dtos/recurringRule.dto";
import { v4 as uuid } from "uuid";
import { AppError } from "../../errors/AppError";

export class AddRecurringRuleUC implements IAddRecurringRuleUC {
	constructor(private _availabilityRepository: IAvailabilityRepository) {}

	async execute(dto: addRecurringRuleDto): Promise<void> {
		const { mentorId, rule } = dto;
		const existingAvailabilityRule =
			await this._availabilityRepository.findByMentorId(mentorId);
		if (!existingAvailabilityRule)
			throw new AppError(
				ErrorMessage.AVAILABILITY_NOT_FOUND,
				HttpStatus.BAD_REQUEST,
			);

		const updatedRecurringRules = [
			...existingAvailabilityRule.recurringRules,
			{ ...rule, ruleId: uuid() },
		];

		await this._availabilityRepository.update(existingAvailabilityRule.id, {
			recurringRules: updatedRecurringRules,
		});
	}
}

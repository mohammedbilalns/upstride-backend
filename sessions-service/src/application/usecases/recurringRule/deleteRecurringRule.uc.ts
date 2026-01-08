import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { IDeleteRecurringRuleUC } from "../../../domain/useCases/recurringRule/deleteRecurringRule.uc.interface";
import { DeleteRecurringRuleDto } from "../../dtos/recurringRule.dto";
import { AppError } from "../../errors/AppError";

import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";

export class DeleteRecurringRuleUC implements IDeleteRecurringRuleUC {
	constructor(
		private _availabilityRepository: IAvailabilityRepository,
		private _slotRepository: ISlotRepository,
	) {}

	async execute(dto: DeleteRecurringRuleDto): Promise<void> {
		const existingAvailabilityRule =
			await this._availabilityRepository.findByMentorId(dto.mentorId);

		if (!existingAvailabilityRule) {
			throw new AppError(ErrorMessage.RULE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		// Update availability
		const updatedRule = {
			...existingAvailabilityRule,
			recurringRules: existingAvailabilityRule.recurringRules.filter(
				(rule) => rule.ruleId !== dto.ruleId,
			),
		};

		await this._availabilityRepository.update(
			existingAvailabilityRule.id,
			updatedRule,
		);

		// Delete slots if requested
		if (dto.deleteSlots) {
			await this._slotRepository.deleteUnbookedFutureSlots(dto.ruleId);
		}
	}
}

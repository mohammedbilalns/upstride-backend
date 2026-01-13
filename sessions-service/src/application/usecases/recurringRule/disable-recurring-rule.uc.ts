import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { IDisableRecurringRuleUC } from "../../../domain/useCases/recurringRule/disable-recurring-rule.uc.interface";
import { DisableRecurringRuleDto } from "../../dtos/recurring-rule.dto";
import { AppError } from "../../errors/app-error";

export class DisableRecurringRuleUC implements IDisableRecurringRuleUC {
	constructor(
		private _availabilityRepository: IAvailabilityRepository,
		private _slotRepository: ISlotRepository,
	) {}

	async execute(dto: DisableRecurringRuleDto): Promise<void> {
		const existingAvailabilityRule =
			await this._availabilityRepository.findByMentorId(dto.mentorId);

		if (!existingAvailabilityRule)
			throw new AppError(
				ErrorMessage.AVAILABILITY_NOT_FOUND,
				HttpStatus.BAD_REQUEST,
			);

		const updatedRecurringRules = existingAvailabilityRule?.recurringRules.map(
			(r) => {
				if (r.ruleId === dto.ruleId) {
					return { ...r, isActive: false };
				}
				return r;
			},
		);

		await Promise.all([
			this._availabilityRepository.update(existingAvailabilityRule?.id, {
				recurringRules: updatedRecurringRules,
			}),
			this._slotRepository.toggleSlotStatusByRuleId(dto.ruleId, false),
		]);
	}
}

import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { IEnableRecurringRuleUC } from "../../../domain/useCases/recurringRule/enableRecurringRule.uc.interface";
import { enableRecurringRuleDto } from "../../dtos/recurringRule.dto";
import { AppError } from "../../errors/AppError";

export class EnableRecurringRuleUC implements IEnableRecurringRuleUC {
	constructor(
		private _availabilityRepository: IAvailabilityRepository,
		private _slotRepository: ISlotRepository,
	) {}

	async execute(dto: enableRecurringRuleDto): Promise<void> {
		const existingAvailabilityRule =
			await this._availabilityRepository.findByMentorId(dto.mentorId);
		if (!existingAvailabilityRule)
			throw new AppError(
				ErrorMessage.AVAILABILITY_NOT_FOUND,
				HttpStatus.NOT_FOUND,
			);

		const updatedRecurringRules = existingAvailabilityRule?.recurringRules.map(
			(r) => {
				if (r.ruleId === dto.ruleId) {
					return { ...r, isActive: true };
				}
				return r;
			},
		);

		await Promise.all([
			this._availabilityRepository.update(existingAvailabilityRule?.id, {
				recurringRules: updatedRecurringRules,
			}),
			this._slotRepository.toggleSlotStatusByRuleId(dto.ruleId, true),
		]);
	}
}

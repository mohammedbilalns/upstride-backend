import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { IDisableRecurringRuleUC } from "../../../domain/useCases/recurringRule/disableRecurringRule.uc.interface";
import { disableRecurringRuleDto } from "../../dtos/recurringRule.dto";
import { AppError } from "../../errors/AppError";

export class DisableRecurringRuleUC implements IDisableRecurringRuleUC {
	constructor(private _availabilityRepository: IAvailabilityRepository) {}

	async execute(dto: disableRecurringRuleDto): Promise<void> {
		const { mentorId, ruleId } = dto;

		const existingAvailabilityRule =
			await this._availabilityRepository.findByMentorId(mentorId);
		if (!existingAvailabilityRule)
			throw new AppError(
				ErrorMessage.AVAILABILITY_NOT_FOUND,
				HttpStatus.BAD_REQUEST,
			);

		const updatedRecurringRules = existingAvailabilityRule?.recurringRules.map(
			(r) => {
				if (r.ruleId === ruleId) {
					return { ...r, isActive: false };
				}
				return r;
			},
		);

		await this._availabilityRepository.update(existingAvailabilityRule?.id, {
			recurringRules: updatedRecurringRules,
		});
	}
}

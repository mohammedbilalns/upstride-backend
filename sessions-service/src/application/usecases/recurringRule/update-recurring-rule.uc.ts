import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { IUpdateRecurringRuleUC } from "../../../domain/useCases/recurringRule/update-recurring-rule.uc.interface";
import { UpdateRecurringRuleDto } from "../../dtos/recurring-rule.dto";
import { AppError } from "../../errors/app-error";
import { timeToMinutes } from "../../utils/date-utils";

/**
 * Use case: Update an existing recurring availability rule.
 *
 * A recurring rule defines weekly repeating availability (e.g., "Every Monday 09:00–17:00").
 */
import { IGenerateSlotsUC } from "../../../domain/useCases/slots/generate-slots.uc.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";

/**
 * Use case: Update an existing recurring availability rule.
 *
 * A recurring rule defines weekly repeating availability (e.g., "Every Monday 09:00–17:00").
 */
export class UpdateRecurringRuleUC implements IUpdateRecurringRuleUC {
	constructor(
		private _availabilityRepository: IAvailabilityRepository,
		private _generateSlotsUC: IGenerateSlotsUC,
		private _slotRepository: ISlotRepository,
	) {}
	async execute(dto: UpdateRecurringRuleDto): Promise<void> {
		// lookup mentor availability
		const existingAvailabilityRule =
			await this._availabilityRepository.findByMentorId(dto.mentorId);

		if (!existingAvailabilityRule)
			throw new AppError(
				ErrorMessage.AVAILABILITY_NOT_FOUND,
				HttpStatus.BAD_REQUEST,
			);

		// extract rule to update
		const ruleToUpdate = existingAvailabilityRule.recurringRules.find(
			(r) => r.ruleId === dto.ruleId,
		);

		if (!ruleToUpdate) {
			throw new AppError(ErrorMessage.RULE_NOT_FOUND, HttpStatus.BAD_REQUEST);
		}

		// construct updated rule
		const updatedRule = {
			...ruleToUpdate,
			weekDay: dto.rule.weekDay ?? ruleToUpdate.weekDay,
			startTime: dto.rule.startTime
				? timeToMinutes(dto.rule.startTime)
				: ruleToUpdate.startTime,
			endTime: dto.rule.endTime
				? timeToMinutes(dto.rule.endTime)
				: ruleToUpdate.endTime,
			slotDuration: dto.rule.slotDuration ?? ruleToUpdate.slotDuration,
			price: dto.rule.price ?? ruleToUpdate.price,
		};

		// validate start time is before end time
		if (updatedRule.startTime >= updatedRule.endTime) {
			throw new AppError(
				ErrorMessage.START_TIME_GREATER_THAN_END_TIME,
				HttpStatus.BAD_REQUEST,
			);
		}

		if (
			updatedRule.endTime - updatedRule.startTime !==
			updatedRule.slotDuration
		) {
			throw new AppError(
				ErrorMessage.INVALID_INPUT_DATA,
				HttpStatus.BAD_REQUEST,
			);
		}

		// validate there is no conflicting rule
		const conflictingRule = existingAvailabilityRule.recurringRules.find(
			(r) => {
				if (r.ruleId === dto.ruleId) return false;
				if (r.weekDay !== updatedRule.weekDay) return false;

				const overlap =
					r.startTime < updatedRule.endTime &&
					r.endTime > updatedRule.startTime;

				return overlap;
			},
		);

		if (conflictingRule) {
			throw new AppError(ErrorMessage.CONFLICTING_RULE, HttpStatus.CONFLICT);
		}

		// create updated recurring rule and save
		const updatedRecurringRules = existingAvailabilityRule.recurringRules.map(
			(r) => {
				if (r.ruleId === dto.ruleId) {
					return updatedRule;
				}
				return r;
			},
		);

		await this._availabilityRepository.update(existingAvailabilityRule.id, {
			recurringRules: updatedRecurringRules,
		});

		// Invalidate existing slots if requested
		if (dto.invalidateExisting) {
			await this._slotRepository.deleteUnbookedFutureSlots(dto.ruleId);
		}

		// Trigger slot generation
		await this._generateSlotsUC.execute(dto.mentorId);
	}
}

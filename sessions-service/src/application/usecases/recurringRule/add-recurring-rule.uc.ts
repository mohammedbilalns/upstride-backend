import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { IAddRecurringRuleUC } from "../../../domain/useCases/recurringRule/add-recurring-rule.uc.interface";
import { AddRecurringRuleDto } from "../../dtos/recurring-rule.dto";
import { v4 as uuid } from "uuid";
import { AppError } from "../../errors/app-error";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { timeToMinutes } from "../../utils/date-utils";

/**
 * Use case: Add a recurring rule for a mentor.
 *
 * A recurring rule defines weekly availability (e.g., "Every Monday from 09:00 to 17:00").
 */
import { IGenerateSlotsUC } from "../../../domain/useCases/slots/generate-slots.uc.interface";

/**
 * Use case: Add a recurring rule for a mentor.
 *
 * A recurring rule defines weekly availability (e.g., "Every Monday from 09:00 to 17:00").
 */
export class AddRecurringRuleUC implements IAddRecurringRuleUC {
	constructor(
		private _availabilityRepository: IAvailabilityRepository,
		private _generateSlotsUC: IGenerateSlotsUC,
	) {}

	async execute(ruleDetails: AddRecurringRuleDto): Promise<void> {
		// fetch or create availability
		const existingAvailabilityRule =
			await this._availabilityRepository.fetchOrCreateByMentorId(
				ruleDetails.mentorId,
			);
		const newRule = {
			...ruleDetails.rule,
			startTime: timeToMinutes(ruleDetails.rule.startTime),
			endTime: timeToMinutes(ruleDetails.rule.endTime),
		};

		// validate start time is before end time
		if (newRule.startTime >= newRule.endTime) {
			throw new AppError(
				ErrorMessage.START_TIME_GREATER_THAN_END_TIME,
				HttpStatus.BAD_REQUEST,
			);
		}

		if (newRule.endTime - newRule.startTime !== ruleDetails.rule.slotDuration) {
			throw new AppError(
				ErrorMessage.INVALID_INPUT_DATA,
				HttpStatus.BAD_REQUEST,
			);
		}

		// validate there is no conflicting rule
		const conflictingRule = existingAvailabilityRule.recurringRules.find(
			(r) => {
				const sameDay = r.weekDay === newRule.weekDay;
				const overlap =
					r.startTime <= newRule.endTime && r.endTime >= newRule.endTime;
				return sameDay && overlap;
			},
		);

		if (conflictingRule) {
			throw new AppError(ErrorMessage.CONFLICTING_RULE, HttpStatus.CONFLICT);
		}

		// Append new rule to existing rules and save
		const updatedRecurringRules = [
			...existingAvailabilityRule.recurringRules,
			{ ...newRule, ruleId: uuid() },
		];

		await this._availabilityRepository.update(existingAvailabilityRule.id, {
			recurringRules: updatedRecurringRules,
		});

		// Trigger slot generation
		await this._generateSlotsUC.execute(ruleDetails.mentorId);
	}
}

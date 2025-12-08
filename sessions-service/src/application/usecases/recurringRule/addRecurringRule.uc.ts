import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { IAddRecurringRuleUC } from "../../../domain/useCases/recurringRule/addRecurringRule.uc.interface";
import { addRecurringRuleDto } from "../../dtos/recurringRule.dto";
import { v4 as uuid } from "uuid";
import { AppError } from "../../errors/AppError";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { timeToMinutes } from "../../utils/dateUtils";

/**
 * Use case: Add a recurring rule for a mentor.
 *
 * A recurring rule defines weekly availability (e.g., "Every Monday from 09:00 to 17:00").
 */
export class AddRecurringRuleUC implements IAddRecurringRuleUC {
	constructor(private _availabilityRepository: IAvailabilityRepository) {}

	async execute(dto: addRecurringRuleDto): Promise<void> {
		// fetch or create availability
		const existingAvailabilityRule =
			await this._availabilityRepository.fetchOrCreateByMentorId(dto.mentorId);
		const newRule = {
			...dto.rule,
			startTime: timeToMinutes(dto.rule.startTime),
			endTime: timeToMinutes(dto.rule.endTime),
		};

		// validate start time is before end time
		if (newRule.startTime >= newRule.endTime) {
			throw new AppError(
				ErrorMessage.START_TIME_GREATER_THAN_END_TIME,
				HttpStatus.BAD_REQUEST,
			);
		}

		// validate there is no conflicting rule
		const conflictingRule = existingAvailabilityRule.recurringRules.find(
			(r) => {
				const sameDay = r.weekDay === newRule.weekDay;
				const overlap =
					r.startTime < newRule.endTime && r.endTime > newRule.endTime;
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
	}
}

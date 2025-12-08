import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { IUpdateRecurringRuleUC } from "../../../domain/useCases/recurringRule/updateRecurringRule.uc.interface";
import { updateRecurringRuleDto } from "../../dtos/recurringRule.dto";
import { AppError } from "../../errors/AppError";
import { timeToMinutes } from "../../utils/dateUtils";

/**
 * Use case: Update an existing recurring availability rule.
 *
 * A recurring rule defines weekly repeating availability (e.g., "Every Monday 09:00–17:00").
 */
export class UpdateRecurringRuleUC implements IUpdateRecurringRuleUC {
	constructor(private _availabilityRepository: IAvailabilityRepository) {}
	async execute(dto: updateRecurringRuleDto): Promise<void> {
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
		};

		// validate start time is before end time
		if (updatedRule.startTime >= updatedRule.endTime) {
			throw new AppError(
				ErrorMessage.START_TIME_GREATER_THAN_END_TIME,
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
	}
}

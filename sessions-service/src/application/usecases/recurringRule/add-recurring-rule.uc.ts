import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { IAddRecurringRuleUC } from "../../../domain/useCases/recurringRule/add-recurring-rule.uc.interface";
import { AddRecurringRuleDto } from "../../dtos/recurring-rule.dto";
import { v4 as uuid } from "uuid";
import { AppError } from "../../errors/app-error";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { timeToMinutes } from "../../utils/date-utils";

/**
 * Use case: Add a recurring rule for a mentor.
 * A recurring rule defines weekly availability (e.g., "Every Monday from 09:00 to 17:00").
 */
import { IGenerateSlotsUC } from "../../../domain/useCases/slots/generate-slots.uc.interface";


export class AddRecurringRuleUC implements IAddRecurringRuleUC {
  constructor(
    private _availabilityRepository: IAvailabilityRepository,
    private _generateSlotsUC: IGenerateSlotsUC,
  ) { }

  async execute(ruleDetails: AddRecurringRuleDto): Promise<void> {
    let existingAvailability =
      await this._availabilityRepository.fetchOrCreateByMentorId(
        ruleDetails.mentorId,
      );

    if (existingAvailability.recurringRules.length >= 15) {
      throw new AppError(
        ErrorMessage.MAX_RECURRING_RULES_EXCEEDED,
        HttpStatus.BAD_REQUEST,
      );
    }

    // create new rules by converting time to minutes
    const newRule = {
      ...ruleDetails,
      startTime: timeToMinutes(ruleDetails.startTime),
      endTime: timeToMinutes(ruleDetails.endTime),
    };

    // validate start time is before end time
    if (newRule.startTime >= newRule.endTime) {
      throw new AppError(
        ErrorMessage.START_TIME_GREATER_THAN_END_TIME,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (newRule.endTime - newRule.startTime !== ruleDetails.slotDuration) {
      throw new AppError(
        ErrorMessage.INVALID_INPUT_DATA,
        HttpStatus.BAD_REQUEST,
      );
    }
    const conflictingRule = existingAvailability.recurringRules.find(
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
      ...existingAvailability.recurringRules,
      { ...newRule, ruleId: uuid() },
    ];

    await this._availabilityRepository.update(existingAvailability.id, {
      recurringRules: updatedRecurringRules,
    });

    await this._generateSlotsUC.execute(ruleDetails.mentorId);

  }
}

import { inject, injectable } from "inversify";
import { Availability } from "../../../domain/entities/session-availability.entity";
import type { IMentorRepository } from "../../../domain/repositories/mentor.repository.interface";
import type { ISessionAvailabilityRepository } from "../../../domain/repositories/session-availability.repository.interface";
import { TYPES } from "../../../shared/types/types";
import { MentorNotFoundError } from "../../mentor-lists/errors";
import type { IGenerateSlotsUseCase } from "../../session-slot-management/use-cases/generate-slots.usecase.interface";
import { ValidationError } from "../../shared/errors/validation-error";
import type {
	UpdateRecurringRuleInput,
	UpdateRecurringRuleResponse,
} from "../dtos/recurring-rules.dto";
import {
	AvailabilityNotFoundError,
	RecurringRuleNotFoundError,
} from "../errors";
import { hasRecurringRuleOverlap } from "../utils/recurring-rule-overlap";
import type { IUpdateRecurringRuleUseCase } from "./update-recurring-rule.usecase.interface";

@injectable()
export class UpdateRecurringRuleUseCase implements IUpdateRecurringRuleUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
		@inject(TYPES.Repositories.SessionAvailabilityRepository)
		private readonly _availabilityRepository: ISessionAvailabilityRepository,
		@inject(TYPES.UseCases.GenerateSlots)
		private readonly _generateSlotsUseCase: IGenerateSlotsUseCase,
	) {}

	async execute({
		userId,
		ruleId,
		updates,
	}: UpdateRecurringRuleInput): Promise<UpdateRecurringRuleResponse> {
		const mentor = await this._mentorRepository.findByUserId(userId);
		if (!mentor) {
			throw new MentorNotFoundError();
		}

		const availability = await this._availabilityRepository.findByOwnerId(
			mentor.id,
		);
		if (!availability) {
			throw new AvailabilityNotFoundError();
		}

		const rules = availability.recurringRules.map((rule) =>
			rule.ruleId === ruleId
				? {
						...rule,
						weekDay: updates.weekDay ?? rule.weekDay,
						startTime: updates.startTime ?? rule.startTime,
						endTime: updates.endTime ?? rule.endTime,
						slotDuration: updates.slotDuration ?? rule.slotDuration,
						isActive: updates.isActive ?? rule.isActive,
					}
				: rule,
		);

		const updatedRule = rules.find((rule) => rule.ruleId === ruleId);
		if (!updatedRule) {
			throw new RecurringRuleNotFoundError();
		}

		if (updatedRule.isActive ?? true) {
			const hasOverlap = hasRecurringRuleOverlap(
				rules,
				updatedRule,
				updatedRule.ruleId,
			);

			if (hasOverlap) {
				throw new ValidationError(
					"Recurring rule overlaps with an existing rule",
				);
			}
		}

		new Availability(availability.id, rules, mentor.id, availability.createdAt);

		await this._availabilityRepository.updateById(availability.id, {
			recurringRules: rules,
		});

		await this._generateSlotsUseCase.execute({ mentorId: mentor.id });

		return { rule: updatedRule };
	}
}

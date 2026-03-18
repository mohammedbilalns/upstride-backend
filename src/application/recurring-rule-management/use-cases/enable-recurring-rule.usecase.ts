import { inject, injectable } from "inversify";
import type { IMentorRepository } from "../../../domain/repositories/mentor.repository.interface";
import type { ISessionAvailabilityRepository } from "../../../domain/repositories/session-availability.repository.interface";
import { TYPES } from "../../../shared/types/types";
import { MentorNotFoundError } from "../../mentor-lists/errors";
import { ValidationError } from "../../shared/errors/validation-error";
import type {
	ToggleRecurringRuleInput,
	ToggleRecurringRuleResponse,
} from "../dtos/recurring-rules.dto";
import {
	AvailabilityNotFoundError,
	RecurringRuleNotFoundError,
} from "../errors";
import type { IEnableRecurringRuleUseCase } from "./enable-recurring-rule.usecase.interface";

@injectable()
export class EnableRecurringRuleUseCase implements IEnableRecurringRuleUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
		@inject(TYPES.Repositories.SessionAvailabilityRepository)
		private readonly _availabilityRepository: ISessionAvailabilityRepository,
	) {}

	async execute({
		userId,
		ruleId,
	}: ToggleRecurringRuleInput): Promise<ToggleRecurringRuleResponse> {
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
			rule.ruleId === ruleId ? { ...rule, isActive: true } : rule,
		);

		const updatedRule = rules.find((rule) => rule.ruleId === ruleId);
		if (!updatedRule) {
			throw new RecurringRuleNotFoundError();
		}

		const hasOverlap = rules.some(
			(existing) =>
				existing.ruleId !== updatedRule.ruleId &&
				(existing.isActive ?? true) &&
				existing.weekDay === updatedRule.weekDay &&
				updatedRule.startTime < existing.endTime &&
				updatedRule.endTime > existing.startTime,
		);

		if (hasOverlap) {
			throw new ValidationError(
				"Recurring rule overlaps with an existing rule",
			);
		}

		await this._availabilityRepository.updateById(availability.id, {
			recurringRules: rules,
		});

		return { rule: updatedRule };
	}
}

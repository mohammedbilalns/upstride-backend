import { inject, injectable } from "inversify";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { ISessionAvailabilityRepository } from "../../../../domain/repositories/session-availability.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { MentorNotFoundError } from "../../../shared/errors/mentor-not-found.error";
import type {
	ToggleRecurringRuleInput,
	ToggleRecurringRuleResponse,
} from "../dtos/recurring-rules.dto";
import {
	AvailabilityNotFoundError,
	RecurringRuleNotFoundError,
} from "../errors";
import type { IDisableRecurringRuleUseCase } from "./disable-recurring-rule.usecase.interface";

@injectable()
export class DisableRecurringRuleUseCase
	implements IDisableRecurringRuleUseCase
{
	constructor(
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorRepository: IMentorWriteRepository,
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
			rule.ruleId === ruleId ? { ...rule, isActive: false } : rule,
		);

		const updatedRule = rules.find((rule) => rule.ruleId === ruleId);
		if (!updatedRule) {
			throw new RecurringRuleNotFoundError();
		}

		await this._availabilityRepository.updateById(availability.id, {
			recurringRules: rules,
		});

		return { rule: updatedRule };
	}
}

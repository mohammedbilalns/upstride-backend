import { inject, injectable } from "inversify";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { ISessionAvailabilityRepository } from "../../../../domain/repositories/session-availability.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import type {
	ToggleRecurringRuleInput,
	ToggleRecurringRuleResponse,
} from "../dtos/recurring-rules.dto";
import { RecurringRuleNotFoundError } from "../errors";
import { getAvailabilityByMentorIdOrThrow } from "../utils/availability.util";
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
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorRepository,
			userId,
		);

		const availability = await getAvailabilityByMentorIdOrThrow(
			this._availabilityRepository,
			mentor.id,
		);

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

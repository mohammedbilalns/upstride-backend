import { inject, injectable } from "inversify";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { ISessionAvailabilityRepository } from "../../../../domain/repositories/session-availability.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import type {
	DeleteRecurringRuleInput,
	DeleteRecurringRuleResponse,
} from "../dtos/recurring-rules.dto";
import { RecurringRuleNotFoundError } from "../errors";
import { getAvailabilityByMentorIdOrThrow } from "../utils/availability.util";
import type { IDeleteRecurringRuleUseCase } from "./delete-recurring-rule.usecase.interface";

@injectable()
export class DeleteRecurringRuleUseCase implements IDeleteRecurringRuleUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorRepository: IMentorWriteRepository,
		@inject(TYPES.Repositories.SessionAvailabilityRepository)
		private readonly _availabilityRepository: ISessionAvailabilityRepository,
	) {}

	async execute({
		userId,
		ruleId,
	}: DeleteRecurringRuleInput): Promise<DeleteRecurringRuleResponse> {
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorRepository,
			userId,
		);

		const availability = await getAvailabilityByMentorIdOrThrow(
			this._availabilityRepository,
			mentor.id,
		);

		const existing = availability.recurringRules.find(
			(rule) => rule.ruleId === ruleId,
		);
		if (!existing) {
			throw new RecurringRuleNotFoundError();
		}

		const updatedRules = availability.recurringRules.filter(
			(rule) => rule.ruleId !== ruleId,
		);

		await this._availabilityRepository.updateById(availability.id, {
			recurringRules: updatedRules,
		});

		return { ruleId };
	}
}

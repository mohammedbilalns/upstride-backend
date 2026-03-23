import { inject, injectable } from "inversify";
import { Availability } from "../../../../domain/entities/session-availability.entity";
import type { IMentorRepository } from "../../../../domain/repositories/mentor.repository.interface";
import type { ISessionAvailabilityRepository } from "../../../../domain/repositories/session-availability.repository.interface";
import { SessionSlotLimits } from "../../../../shared/constants/app.constants";
import { TYPES } from "../../../../shared/types/types";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import { MentorNotFoundError } from "../../../shared/errors/mentor-not-found.error";
import { ValidationError } from "../../../shared/errors/validation-error";
import type { IGenerateSlotsUseCase } from "../../session-slot-management/use-cases/generate-slots.usecase.interface";
import type {
	AddRecurringRuleInput,
	AddRecurringRuleResponse,
} from "../dtos/recurring-rules.dto";
import { hasRecurringRuleOverlap } from "../utils/recurring-rule-overlap";
import type { IAddRecurringRuleUseCase } from "./add-recurring-rule.usecase.interface";

@injectable()
export class AddRecurringRuleUseCase implements IAddRecurringRuleUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
		@inject(TYPES.Repositories.SessionAvailabilityRepository)
		private readonly _availabilityRepository: ISessionAvailabilityRepository,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
		@inject(TYPES.UseCases.GenerateSlots)
		private readonly _generateSlotsUseCase: IGenerateSlotsUseCase,
	) {}

	async execute({
		userId,
		rule,
	}: AddRecurringRuleInput): Promise<AddRecurringRuleResponse> {
		const mentor = await this._mentorRepository.findByUserId(userId);
		if (!mentor) {
			throw new MentorNotFoundError();
		}

		const availability = await this._availabilityRepository.findByOwnerId(
			mentor.id,
		);

		const newRule = {
			ruleId: this._idGenerator.generate(),
			weekDay: rule.weekDay,
			startTime: rule.startTime,
			endTime: rule.endTime,
			slotDuration: rule.slotDuration,
			isActive: true,
		};

		const hasOverlap = hasRecurringRuleOverlap(
			availability?.recurringRules ?? [],
			newRule,
		);

		if (hasOverlap) {
			throw new ValidationError(
				"Recurring rule overlaps with an existing rule",
			);
		}

		const existingRules = availability?.recurringRules ?? [];
		const rulesForDay = existingRules.filter(
			(existingRule) => existingRule.weekDay === newRule.weekDay,
		);
		if (rulesForDay.length >= SessionSlotLimits.MAX_RECURRING_RULE_PER_DAY) {
			throw new ValidationError(
				`Maximum of ${SessionSlotLimits.MAX_RECURRING_RULE_PER_DAY} recurring rules per day allowed`,
			);
		}

		if (!availability) {
			const created = new Availability(
				this._idGenerator.generate(),
				[newRule],
				mentor.id,
				new Date(),
			);
			await this._availabilityRepository.create(created);
		} else {
			const updatedRules = [...availability.recurringRules, newRule];
			new Availability(
				availability.id,
				updatedRules,
				mentor.id,
				availability.createdAt,
			);
			await this._availabilityRepository.updateById(availability.id, {
				recurringRules: updatedRules,
			});
		}

		await this._generateSlotsUseCase.execute({ mentorId: mentor.id });

		return { rule: newRule };
	}
}

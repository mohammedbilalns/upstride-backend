import { inject, injectable } from "inversify";
import { Availability } from "../../../../domain/entities/session-availability.entity";
import type { IMentorWriteRepository } from "../../../../domain/repositories/mentor-write.repository.interface";
import type { ISessionAvailabilityRepository } from "../../../../domain/repositories/session-availability.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import { getMentorByUserIdOrThrow } from "../../../shared/utilities/mentor.util";
import type { IGenerateSlotsUseCase } from "../../session-slot-management/use-cases/generate-slots.usecase.interface";
import type {
	AddRecurringRuleInput,
	AddRecurringRuleResponse,
} from "../dtos/recurring-rules.dto";
import type { IAddRecurringRuleUseCase } from "./add-recurring-rule.usecase.interface";

@injectable()
export class AddRecurringRuleUseCase implements IAddRecurringRuleUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorRepository: IMentorWriteRepository,
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
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorRepository,
			userId,
		);

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

		if (!availability) {
			const created = new Availability(
				this._idGenerator.generate(),
				[newRule],
				mentor.id,
				new Date(),
			);
			await this._availabilityRepository.create(created);
		} else {
			availability.addRule(newRule);
			await this._availabilityRepository.updateById(availability.id, {
				recurringRules: availability.recurringRules,
			});
		}

		await this._generateSlotsUseCase.execute({ mentorId: mentor.id });

		return { rule: newRule };
	}
}

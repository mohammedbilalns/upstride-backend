import { inject, injectable } from "inversify";
import type { IMentorRepository } from "../../../../domain/repositories/mentor.repository.interface";
import type { ISessionSlotRepository } from "../../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { PlatformSettingsService } from "../../../services/platform-settings.service";
import { NotFoundError } from "../../../shared/errors/not-found-error";
import type {
	GetMentorSlotsInput,
	GetMentorSlotsResponse,
} from "../dtos/session-slots.dto";
import type { IGetMentorSlotsUseCase } from "./get-mentor-slots.usecase.interface";

@injectable()
export class GetMentorSlotsUseCase implements IGetMentorSlotsUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
		@inject(TYPES.Repositories.SessionSlotRepository)
		private readonly _slotRepository: ISessionSlotRepository,
		@inject(TYPES.Services.PlatformSettings)
		private readonly _platformSettingsService: PlatformSettingsService,
	) {}

	//FIX:  has a side effect that mutates mentor state:
	async execute({
		userId,
		startDate,
		endDate,
	}: GetMentorSlotsInput): Promise<GetMentorSlotsResponse> {
		const mentor = await this._mentorRepository.findByUserId(userId);
		if (!mentor) {
			throw new NotFoundError("Mentor profile not found");
		}
		if (mentor.tierName === null || mentor.tierMax30minPayment === null) {
			const starterTier = this._platformSettingsService.mentors.starter;
			await this._mentorRepository.updateById(mentor.id, {
				tierName: starterTier.name,
				tierMax30minPayment: starterTier.maxPricePer30Min,
				currentPricePer30Min: starterTier.maxPricePer30Min,
			});
		}

		let slots: Awaited<ReturnType<ISessionSlotRepository["findByMentorId"]>>;
		if (startDate && endDate) {
			slots = await this._slotRepository.findByMentorIdAndRange(
				mentor.id,
				new Date(startDate),
				new Date(endDate),
			);
		} else {
			slots = await this._slotRepository.findByMentorId(mentor.id);
		}

		return {
			slots: slots.map((slot) => ({
				id: slot.id,
				startTime: slot.startTime,
				endTime: slot.endTime,
				durationMinutes: slot.durationMinutes,
				price: slot.price,
				status: slot.status,
				bookingId: slot.bookingId,
				createdFromRuleId: slot.createdFromRuleId,
			})),
		};
	}
}

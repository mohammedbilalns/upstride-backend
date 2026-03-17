import { inject, injectable } from "inversify";
import type { IMentorRepository } from "../../../domain/repositories/mentor.repository.interface";
import type { ISessionSlotRepository } from "../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../shared/types/types";
import { NotFoundError } from "../../shared/errors/not-found-error";
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
	) {}

	async execute({
		userId,
		startDate,
		endDate,
	}: GetMentorSlotsInput): Promise<GetMentorSlotsResponse> {
		const mentor = await this._mentorRepository.findByUserId(userId);
		if (!mentor) {
			throw new NotFoundError("Mentor profile not found");
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

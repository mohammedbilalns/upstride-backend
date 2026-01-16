import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { IGetMentorSlotsUC } from "../../../domain/useCases/slots/get-mentor-slots.uc.interface";
import { GetMentorSlotsDto, GetMentorSlotsResponse } from "../../dtos/slot.dto";

export class GetMentorSlotsUC implements IGetMentorSlotsUC {
	constructor(private _slotRepository: ISlotRepository) { }

	/**
	 * Retrieves slots for a mentor.
	 */
	async execute(dto: GetMentorSlotsDto): Promise<GetMentorSlotsResponse> {
		let startDate: Date | undefined;
		let endDate: Date | undefined;

		if (dto.month !== undefined && dto.year !== undefined) {

			startDate = new Date(dto.year, dto.month, 1);
			endDate = new Date(dto.year, dto.month + 1, 0, 23, 59, 59, 999);
		}

		if (dto.availableOnly) {
			const slots = await this._slotRepository.findUpcomingByMentor(
				dto.mentorId,
				new Date(),
				startDate,
				endDate,
				dto.userId,
			);
			return { slots };
		}

		const filter: any = { mentorId: dto.mentorId };
		if (startDate && endDate) {
			filter.startAt = { $gte: startDate, $lte: endDate };
		}

		const slots = await this._slotRepository.find(filter);
		return { slots };
	}
}

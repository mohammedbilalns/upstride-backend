import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { IGetMentorSlotsUC } from "../../../domain/useCases/slots/get-mentor-slots.uc.interface";
import { GetMentorSlotsDto, GetMentorSlotsResponse } from "../../dtos/slot.dto";

export class GetMentorSlotsUC implements IGetMentorSlotsUC {
	constructor(private _slotRepository: ISlotRepository) {}

	// fetch for the mentor
	async execute(dto: GetMentorSlotsDto): Promise<GetMentorSlotsResponse> {
		if (dto.availableOnly) {
			const slots = await this._slotRepository.findUpcomingByMentor(
				dto.mentorId,
			);
			return { slots };
		}
		const slots = await this._slotRepository.find({ mentorId: dto.mentorId });
		return { slots };
	}
}

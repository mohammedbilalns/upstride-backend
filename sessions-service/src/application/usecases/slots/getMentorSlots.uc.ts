import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { IGetMentorSlotsUC } from "../../../domain/useCases/slots/getMentorSlots.uc.interface";
import { getMentorSlotsDto, getMentorSlotsResponse } from "../../dtos/slot.dto";

export class GetMentorSlotsUC implements IGetMentorSlotsUC {
	constructor(private _slotRepository: ISlotRepository) {}

	// fetch for the mentor
	async execute(dto: getMentorSlotsDto): Promise<getMentorSlotsResponse> {
		const slots = await this._slotRepository.findUpcomingByMentor(dto.mentorId);
		return { slots };
	}
}

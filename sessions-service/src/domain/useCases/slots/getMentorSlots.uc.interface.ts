import {
	getMentorSlotsDto,
	getMentorSlotsResponse,
} from "../../../application/dtos/slot.dto";

export interface IGetMentorSlotsUC {
	execute(dto: getMentorSlotsDto): Promise<getMentorSlotsResponse>;
}

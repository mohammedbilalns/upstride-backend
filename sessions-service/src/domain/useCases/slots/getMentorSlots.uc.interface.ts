import {
	GetMentorSlotsDto,
	GetMentorSlotsResponse,
} from "../../../application/dtos/slot.dto";

export interface IGetMentorSlotsUC {
	execute(dto: GetMentorSlotsDto): Promise<GetMentorSlotsResponse>;
}

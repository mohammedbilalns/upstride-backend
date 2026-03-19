import type {
	GetMentorSlotsInput,
	GetMentorSlotsResponse,
} from "../dtos/session-slots.dto";

export interface IGetMentorSlotsUseCase {
	execute(input: GetMentorSlotsInput): Promise<GetMentorSlotsResponse>;
}

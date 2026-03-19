import type {
	GetPublicMentorAvailableSlotsInput,
	GetPublicMentorAvailableSlotsResponse,
} from "../dtos/public-mentor-slots.dto";

export interface IGetPublicMentorAvailableSlotsUseCase {
	execute(
		input: GetPublicMentorAvailableSlotsInput,
	): Promise<GetPublicMentorAvailableSlotsResponse>;
}

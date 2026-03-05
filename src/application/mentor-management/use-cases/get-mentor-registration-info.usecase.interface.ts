import type {
	GetMentorRegistrationInfoInput,
	MentorRegistrationInfoOutput,
} from "../dtos/get-mentor-registration-info.dto";

export interface IGetMentorRegistrationInfoUseCase {
	execute(
		input: GetMentorRegistrationInfoInput,
	): Promise<MentorRegistrationInfoOutput>;
}

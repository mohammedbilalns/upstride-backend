import type {
	GetMentorProfileInput,
	GetMentorProfileResponse,
} from "../dtos/get-mentor-profile.dto";

export interface IGetMentorProfileUseCase {
	execute(input: GetMentorProfileInput): Promise<GetMentorProfileResponse>;
}

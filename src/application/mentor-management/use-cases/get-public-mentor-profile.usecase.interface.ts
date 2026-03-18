import type {
	GetPublicMentorProfileInput,
	GetPublicMentorProfileResponse,
} from "../dtos/get-public-mentor-profile.dto";

export interface IGetPublicMentorProfileUseCase {
	execute(
		input: GetPublicMentorProfileInput,
	): Promise<GetPublicMentorProfileResponse>;
}

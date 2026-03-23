import type {
	UpdateMentorProfileInput,
	UpdateMentorProfileResponse,
} from "../dtos/update-mentor-profile.dto";

export interface IUpdateMentorProfileUseCase {
	execute(
		input: UpdateMentorProfileInput,
	): Promise<UpdateMentorProfileResponse>;
}

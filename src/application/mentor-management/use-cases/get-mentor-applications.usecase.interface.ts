import type {
	GetMentorApplicationsInput,
	GetMentorApplicationsResponse,
} from "../dtos/get-mentor-applications.dto";

export interface IGetMentorApplicationsUseCase {
	execute(
		input: GetMentorApplicationsInput,
	): Promise<GetMentorApplicationsResponse>;
}

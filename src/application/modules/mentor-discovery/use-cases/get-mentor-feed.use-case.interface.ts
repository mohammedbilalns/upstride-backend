import type {
	GetMentorFeedInput,
	GetMentorsResponse,
} from "../dtos/get-mentors.dto";

export interface IGetMentorFeedUseCase {
	execute(input: GetMentorFeedInput): Promise<GetMentorsResponse>;
}

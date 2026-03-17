import type {
	GetMentorsInput,
	GetMentorsResponse,
} from "../dtos/get-mentors.dto";

export interface IGetMentorsUseCase {
	execute(input: GetMentorsInput): Promise<GetMentorsResponse>;
}

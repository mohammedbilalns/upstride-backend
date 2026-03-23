import type {
	GetMentorListsInput,
	GetMentorListsOutput,
} from "../dtos/mentor-list.dto";

export interface IGetMentorListsUseCase {
	execute(input: GetMentorListsInput): Promise<GetMentorListsOutput>;
}

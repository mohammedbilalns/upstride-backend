import type {
	GetMentorListInput,
	GetMentorListOutput,
} from "../dtos/mentor-list.dto";

export interface IGetMentorListUseCase {
	execute(input: GetMentorListInput): Promise<GetMentorListOutput>;
}

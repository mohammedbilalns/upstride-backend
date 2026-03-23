import type {
	CreateMentorListInput,
	CreateMentorListOutput,
} from "../dtos/mentor-list.dto";

export interface ICreateMentorListUseCase {
	execute(input: CreateMentorListInput): Promise<CreateMentorListOutput>;
}

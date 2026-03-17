import type { AddMentorToListInput } from "../dtos/mentor-list.dto";

export interface IAddMentorToListUseCase {
	execute(input: AddMentorToListInput): Promise<void>;
}

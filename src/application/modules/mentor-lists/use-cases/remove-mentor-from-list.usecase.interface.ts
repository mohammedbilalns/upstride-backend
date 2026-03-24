import type { RemoveMentorFromListInput } from "../dtos/mentor-list.dto";

export interface IRemoveMentorFromListUseCase {
	execute(input: RemoveMentorFromListInput): Promise<void>;
}

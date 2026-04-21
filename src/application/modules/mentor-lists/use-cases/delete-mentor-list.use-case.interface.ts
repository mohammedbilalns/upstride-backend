import type { DeleteMentorListInput } from "../dtos/mentor-list.dto";

export interface IDeleteMentorListUseCase {
	execute(input: DeleteMentorListInput): Promise<void>;
}

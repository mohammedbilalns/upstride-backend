import type { ApproveMentorInput } from "../dtos/approve-mentor.dto";

export interface IApproveMentorUseCase {
	execute(input: ApproveMentorInput): Promise<void>;
}

import type { RejectMentorInput } from "../dtos/reject-mentor.dto";

export interface IRejectMentorUseCase {
	execute(input: RejectMentorInput): Promise<void>;
}

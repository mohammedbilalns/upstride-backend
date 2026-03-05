import type { ResubmitMentorInput } from "../dtos/resubmit-mentor.dto";

export interface IResubmitMentorUseCase {
	execute(input: ResubmitMentorInput): Promise<void>;
}

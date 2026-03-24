import type { RegisterMentorInput } from "../dtos/register-mentor.dto";

export interface IRegisterMentorUseCase {
	execute(input: RegisterMentorInput): Promise<void>;
}

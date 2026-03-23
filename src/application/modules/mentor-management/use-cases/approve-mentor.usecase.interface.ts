export interface IApproveMentorUseCase {
	execute(mentorId: string): Promise<void>;
}

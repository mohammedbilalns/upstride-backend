export interface IUnfollowMentorUC {
	execute(userId: string, mentorId: string): Promise<void>;
}

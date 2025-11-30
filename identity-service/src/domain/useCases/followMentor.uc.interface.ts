export interface IFollowMentorUC {
	execute(userId: string, mentorId: string): Promise<void>;
}

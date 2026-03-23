import type { MentorProfileDetails } from "./mentor.repository.types";

export interface IMentorProfileReadRepository {
	findProfileByUserId(userId: string): Promise<MentorProfileDetails | null>;
	findProfileById(mentorId: string): Promise<MentorProfileDetails | null>;
}

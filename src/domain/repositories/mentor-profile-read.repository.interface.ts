import type { MentorForFeed } from "../../shared/utilities/feed-scoring.util";
import type { MentorProfileDetails } from "./mentor.repository.types";

export interface IMentorProfileReadRepository {
	findProfileByUserId(userId: string): Promise<MentorProfileDetails | null>;
	findProfileById(mentorId: string): Promise<MentorProfileDetails | null>;
	findFeedCandidates(
		interests: string[],
		limit: number,
	): Promise<MentorForFeed[]>;
}

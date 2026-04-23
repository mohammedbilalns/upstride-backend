import type {
	PaginatedResult,
	PaginateParams,
} from "./capabilities/paginatable.repository.interface";
import type {
	MentorApplicationDetails,
	MentorDiscoveryDetails,
	MentorDiscoveryQuery,
	MentorQuery,
} from "./mentor.repository.types";

export interface IMentorListReadRepository {
	paginate(
		params: PaginateParams<MentorQuery>,
	): Promise<PaginatedResult<MentorApplicationDetails>>;
	paginateDiscoverable(
		params: PaginateParams<MentorDiscoveryQuery>,
	): Promise<PaginatedResult<MentorDiscoveryDetails>>;
	findUserIdsByExpertise(interestId: string): Promise<string[]>;
	getStats(): Promise<{
		newMentorRequests: number;
		approvedMentors: number;
	}>;
}

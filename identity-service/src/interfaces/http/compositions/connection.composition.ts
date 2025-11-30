import { ConnectionValidationService } from "../../../application/services/connectionValidation.service";
import {
	FetchFollowersUC,
	FetchFollowingUC,
	FetchMutualConnectionsUC,
	FetchRecentActivityUC,
	FetchSuggestedMentorsUC,
	FollowMentorUC,
	UnfollowMentorUC,
} from "../../../application/usecases/connections";
import type {
	IMentorRepository,
	IUserRepository,
} from "../../../domain/repositories";
import type { IConnectionRepository } from "../../../domain/repositories/connection.repository.interface";
import { IConnectionValidationService } from "../../../domain/services/connectionValidation.service.interface";
import {
	MentorRepository,
	UserRepository,
} from "../../../infrastructure/database/repositories";
import { ConnectionRepository } from "../../../infrastructure/database/repositories/connection.repository";
import { ConnectionController } from "../controllers/connection.controller";

export function createConnectionController() {
	// Repositories
	const connectionRepository: IConnectionRepository =
		new ConnectionRepository();
	const userRepository: IUserRepository = new UserRepository();
	const mentorRepository: IMentorRepository = new MentorRepository();

	// Services
	const connectionValidationService: IConnectionValidationService =
		new ConnectionValidationService(
			userRepository,
			mentorRepository,
			connectionRepository,
		);

	// usecases
	const fetchFollowersUC = new FetchFollowersUC(
		mentorRepository,
		connectionRepository,
	);
	const fetchfollowingUC = new FetchFollowingUC(connectionRepository);
	const fetchMutualConnectionsUC = new FetchMutualConnectionsUC(
		connectionRepository,
	);
	const fetchRecentActivityUC = new FetchRecentActivityUC(connectionRepository);
	const fetchSuggestedMentorsUC = new FetchSuggestedMentorsUC(
		userRepository,
		mentorRepository,
	);
	const followMentorUC = new FollowMentorUC(
		connectionRepository,
		connectionValidationService,
	);
	const unfollowMentorUC = new UnfollowMentorUC(
		connectionRepository,
		connectionValidationService,
	);

	return new ConnectionController(
		followMentorUC,
		unfollowMentorUC,
		fetchFollowersUC,
		fetchfollowingUC,
		fetchMutualConnectionsUC,
		fetchRecentActivityUC,
		fetchSuggestedMentorsUC,
	);
}

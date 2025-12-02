import {
	ApproveMentorUC,
	FetchMentorByExpertiseUC,
	FetchMentorDetailsUC,
	FetchMentorsUC,
	FetchSelfUC,
	FindMentorByExpertiseandSkillUC,
	RegisterAsMentorUC,
	RejectMentorUC,
	UpdateMentorUC,
} from "../../../application/usecases/mentorManagement";
import type { IEventBus } from "../../../domain/events/IEventBus";
import type {
	IMentorRepository,
	IUserRepository,
} from "../../../domain/repositories";
import { IConnectionRepository } from "../../../domain/repositories/connection.repository.interface";
import {
	IApproveMentorUC,
	IFetchMentorByExpertiseUC,
	IFetchMentorDetailsUC,
	IUpdateMentorUC,
	IRejectMentorUC,
	IFindMentorByExpertiseandSkillUC,
	IFetchSelfUC,
	IFetchMentorsUC,
	IRegisterAsMentorUC,
} from "../../../domain/useCases/mentorManagement";
import {
	MentorRepository,
	UserRepository,
} from "../../../infrastructure/database/repositories";
import { ConnectionRepository } from "../../../infrastructure/database/repositories/connection.repository";
import EventBus from "../../../infrastructure/events/eventBus";
import { MentorController } from "../controllers/mentor.controller";

/**
 * Factory function to assemble the MentorController with DI
 */
export function createMentorController(): MentorController {
	// ─────────────────────────────────────────────
	// Repositories
	// ─────────────────────────────────────────────
	const mentorRepository: IMentorRepository = new MentorRepository();
	const userRepository: IUserRepository = new UserRepository();
	const connectionRepository: IConnectionRepository =
		new ConnectionRepository();
	// ─────────────────────────────────────────────
	// Event system
	// ─────────────────────────────────────────────
	const eventBus: IEventBus = EventBus;
	// ─────────────────────────────────────────────
	// UseCases
	// ─────────────────────────────────────────────
	const approveMentorUC: IApproveMentorUC = new ApproveMentorUC(
		userRepository,
		mentorRepository,
		eventBus,
	);
	const fetchMentorByExpertiseUC: IFetchMentorByExpertiseUC =
		new FetchMentorByExpertiseUC(mentorRepository);
	const fetchMentorDetailsUC: IFetchMentorDetailsUC = new FetchMentorDetailsUC(
		mentorRepository,
		connectionRepository,
	);
	const fetchMentorsUC: IFetchMentorsUC = new FetchMentorsUC(mentorRepository);
	const fetchSelfUC: IFetchSelfUC = new FetchSelfUC(mentorRepository);
	const findMentorByExpertiseandSkillUC: IFindMentorByExpertiseandSkillUC =
		new FindMentorByExpertiseandSkillUC(mentorRepository);
	const registerAsMentorUC: IRegisterAsMentorUC = new RegisterAsMentorUC(
		userRepository,
		mentorRepository,
	);
	const rejectMentorUC: IRejectMentorUC = new RejectMentorUC(
		userRepository,
		mentorRepository,
	);
	const updateMentorUC: IUpdateMentorUC = new UpdateMentorUC(
		userRepository,
		mentorRepository,
	);

	// ─────────────────────────────────────────────
	// Controller
	// ─────────────────────────────────────────────
	return new MentorController(
		registerAsMentorUC,
		fetchMentorsUC,
		findMentorByExpertiseandSkillUC,
		approveMentorUC,
		rejectMentorUC,
		updateMentorUC,
		fetchMentorByExpertiseUC,
		fetchMentorDetailsUC,
		fetchSelfUC,
	);
}

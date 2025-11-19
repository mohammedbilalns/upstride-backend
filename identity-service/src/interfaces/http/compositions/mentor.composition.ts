import { MentorService } from "../../../application/services/mentor.service";
import type { IEventBus } from "../../../domain/events/IEventBus";
import type {
	IMentorRepository,
	IUserRepository,
} from "../../../domain/repositories";
import { IConnectionRepository } from "../../../domain/repositories/connection.repository.interface";
import type { IMentorService } from "../../../domain/services";
import {
	MentorRepository,
	UserRepository,
} from "../../../infrastructure/database/repositories";
import { ConnectionRepository } from "../../../infrastructure/database/repositories/connection.repository";
import EventBus from "../../../infrastructure/events/eventBus";
import { MentorController } from "../controllers/mentor.controller";

export function createMentorController(): MentorController {
	const mentorRepository: IMentorRepository = new MentorRepository();
	const userRepository: IUserRepository = new UserRepository();
	const connectionRepository: IConnectionRepository =
		new ConnectionRepository();
	const eventBus: IEventBus = EventBus;
	const mentorService: IMentorService = new MentorService(
		mentorRepository,
		userRepository,
		connectionRepository,
		eventBus,
	);
	return new MentorController(mentorService);
}

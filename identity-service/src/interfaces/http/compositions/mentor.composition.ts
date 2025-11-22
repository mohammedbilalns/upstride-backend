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
	// Services
	// ─────────────────────────────────────────────
	const mentorService: IMentorService = new MentorService(
		mentorRepository,
		userRepository,
		connectionRepository,
		eventBus,
	);
	// ─────────────────────────────────────────────
	// Controller
	// ─────────────────────────────────────────────
	return new MentorController(mentorService);
}

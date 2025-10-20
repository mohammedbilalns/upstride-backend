import { ConnectionService } from "../../../application/services/connection.service";
import type {
	IMentorRepository,
	IUserRepository,
} from "../../../domain/repositories";
import type { IConnectionRepository } from "../../../domain/repositories/connection.repository.interface";
import type { IConnectionService } from "../../../domain/services/connection.service.interface";
import {
	MentorRepository,
	UserRepository,
} from "../../../infrastructure/database/repositories";
import { ConnectionRepository } from "../../../infrastructure/database/repositories/connection.repository";
import { ConnectionController } from "../controllers/connection.controller";

export function createConnectionController() {
	const connectionRepository: IConnectionRepository =
		new ConnectionRepository();
	const userRepository: IUserRepository = new UserRepository();
	const mentorRepository: IMentorRepository = new MentorRepository();

	const connectionService: IConnectionService = new ConnectionService(
		connectionRepository,
		userRepository,
		mentorRepository,
	);

	return new ConnectionController(connectionService);
}

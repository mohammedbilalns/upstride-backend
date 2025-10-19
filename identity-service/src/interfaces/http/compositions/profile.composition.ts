import { CryptoService } from "../../../application/services";
import { ProfileService } from "../../../application/services/profile.service";
import type { IEventBus } from "../../../domain/events/IEventBus";
import type { IUserRepository } from "../../../domain/repositories";
import type { ICryptoService } from "../../../domain/services";
import { UserRepository } from "../../../infrastructure/database/repositories";
import EventBus from "../../../infrastructure/events/eventBus";
import { ProfileController } from "../controllers/profile.controller";

export function createProfileController() {
	const userRepository: IUserRepository = new UserRepository();
	const cryptoService: ICryptoService = new CryptoService();
	const eventBus: IEventBus = EventBus;
	const profileService = new ProfileService(
		userRepository,
		cryptoService,
		eventBus,
	);
	return new ProfileController(profileService);
}

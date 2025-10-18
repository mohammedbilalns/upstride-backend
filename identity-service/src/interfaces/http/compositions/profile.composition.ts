import { CryptoService } from "../../../application/services";
import { ProfileService } from "../../../application/services/profile.service";
import { IEventBus } from "../../../domain/events/IEventBus";
import { IMentorRepository, IUserRepository } from "../../../domain/repositories";
import { ICryptoService } from "../../../domain/services";
import { MentorRepository, UserRepository } from "../../../infrastructure/database/repositories";
import EventBus from "../../../infrastructure/events/eventBus";
import { ProfileController } from "../controllers/profile.controller";

export function createProfileController() {
	const userRepository: IUserRepository = new UserRepository();
	const mentorRepository: IMentorRepository = new MentorRepository();
	const cryptoService: ICryptoService = new CryptoService();
	const eventBus: IEventBus = EventBus
	const profileService = new ProfileService(userRepository, mentorRepository, cryptoService,eventBus);
	return new ProfileController(profileService);

}

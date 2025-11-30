import { CryptoService } from "../../../application/services";
import type { IEventBus } from "../../../domain/events/IEventBus";
import type { IUserRepository } from "../../../domain/repositories";
import type { ICryptoService } from "../../../domain/services";
import {
	FetchProfileUC,
	UpdateProfileUC,
	ChangePasswordUC,
} from "../../../application/usecases/profileMangement";
import {
	IFetchProfileUC,
	IUpdateProfileUC,
	IChangePasswordUC,
} from "../../../domain/useCases/profileMangement";
import { UserRepository } from "../../../infrastructure/database/repositories";
import EventBus from "../../../infrastructure/events/eventBus";
import { ProfileController } from "../controllers/profile.controller";

export function createProfileController() {
	// repositories
	const userRepository: IUserRepository = new UserRepository();
	const cryptoService: ICryptoService = new CryptoService();

	// eventbus
	const eventBus: IEventBus = EventBus;

	// usecases
	const fetchProfileUC: IFetchProfileUC = new FetchProfileUC(userRepository);
	const updateProfileUC: IUpdateProfileUC = new UpdateProfileUC(
		userRepository,
		eventBus,
	);
	const changePasswordUC: IChangePasswordUC = new ChangePasswordUC(
		userRepository,
		cryptoService,
	);

	return new ProfileController(
		fetchProfileUC,
		updateProfileUC,
		changePasswordUC,
	);
}

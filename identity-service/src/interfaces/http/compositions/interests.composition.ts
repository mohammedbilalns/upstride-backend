import { InterestsService } from "../../../application/services/interests.service";
import { UserRepository } from "../../../infrastructure/database/repositories/user.repository";
import { InterestsController } from "../controllers/interests.controller";

export function createInterestsController() {
	const userRepository = new UserRepository();
	const interestsService = new InterestsService(userRepository);
	return new InterestsController(interestsService);
}

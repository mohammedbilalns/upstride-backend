import { UserRepository } from "../../../infrastructure/database/repositories/user.repository";
import { InterestsController } from "../controllers/interests.controller";
import { InterestsService } from "../../../application/services/interests.service";

export function createInterestsController(){

	const userRepository = new UserRepository();
	const interestsService = new InterestsService(userRepository);
	return new InterestsController(interestsService);
}

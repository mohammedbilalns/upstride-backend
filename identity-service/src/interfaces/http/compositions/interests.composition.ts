import { FetchInterestsUC } from "../../../application/usecases/userInterestManagement/fetchInterests.uc";
import { UserRepository } from "../../../infrastructure/database/repositories/user.repository";
import { InterestsController } from "../controllers/interests.controller";

export function createInterestsController() {
	const userRepository = new UserRepository();
	const fetchInterestsUC = new FetchInterestsUC(userRepository);
	return new InterestsController(fetchInterestsUC);
}

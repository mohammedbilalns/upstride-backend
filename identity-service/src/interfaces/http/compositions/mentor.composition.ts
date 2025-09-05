import { MentorController } from "../controllers/mentor.controller";
import { MentorService } from "../../../application/services/mentor.service";
import { IMentorRepository,IUserRepository } from "../../../domain/repositories";
import { MentorRepository, UserRepository } from "../../../infrastructure/database/repositories";
import { IMentorService } from "../../../domain/services";


export function createMentorController(): MentorController {
	const mentorRepository : IMentorRepository = new MentorRepository()
	const userRepository : IUserRepository = new UserRepository();
	const mentorService : IMentorService = new MentorService(mentorRepository,userRepository);
	return new MentorController(mentorService);
}

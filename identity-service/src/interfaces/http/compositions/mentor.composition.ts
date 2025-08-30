import { MentorService } from "../../../application/services/mentor.service";
import {
  IMenotorRepository,
  IUserRepository,
} from "../../../domain/repositories";
import { IMentorService } from "../../../domain/services";
import { MentorRepository } from "../../../infrastructure/database/repositories/mentor.repository";
import { UserRepository } from "../../../infrastructure/database/repositories/user.repository";
import { MentorController } from "../controllers/mentor.controller";

export function createMentorController() {
  const mentorRepository: IMenotorRepository = new MentorRepository();
  const userRepository: IUserRepository = new UserRepository();
  const mentorService: IMentorService = new MentorService(
    mentorRepository,
    userRepository,
  );

  return new MentorController(mentorService);
}

import { MentorController } from "../controllers/mentor.controller";
import { MentorService } from "../../../application/services/mentor.service";
import {
  IMentorRepository,
  IUserRepository,
} from "../../../domain/repositories";
import {
  MentorRepository,
  UserRepository,
} from "../../../infrastructure/database/repositories";
import { IMentorService } from "../../../domain/services";
import { IEventBus } from "../../../domain/events/IEventBus";
import EventBus from "../../../infrastructure/events/eventBus";

export function createMentorController(): MentorController {
  const mentorRepository: IMentorRepository = new MentorRepository();
  const userRepository: IUserRepository = new UserRepository();
  const eventBus: IEventBus = EventBus;
  const mentorService: IMentorService = new MentorService(
    mentorRepository,
    userRepository,
    eventBus,
  );
  return new MentorController(mentorService);
}

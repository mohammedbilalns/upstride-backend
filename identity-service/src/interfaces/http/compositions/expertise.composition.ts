import { ExpertiseService } from "../../../application/services/expertise.service";
import type {
	IExpertiseRepository,
	IMentorRepository,
	ISkillRepository,
} from "../../../domain/repositories";
import type { IExpertiseService } from "../../../domain/services";
import { MentorRepository } from "../../../infrastructure/database/repositories";
import { ExpertiseRepository } from "../../../infrastructure/database/repositories/expertise.repository";
import { SkillRepository } from "../../../infrastructure/database/repositories/skill.repository";
import { ExpertiseController } from "../controllers/expertise.controller";

export function createExpertiseController() {
	const expertiseRepository: IExpertiseRepository = new ExpertiseRepository();
	const skillRepository: ISkillRepository = new SkillRepository();
	const mentorRepository: IMentorRepository = new MentorRepository();
	const expertiseService: IExpertiseService = new ExpertiseService(
		expertiseRepository,
		skillRepository,
		mentorRepository,
	);

	return new ExpertiseController(expertiseService);
}

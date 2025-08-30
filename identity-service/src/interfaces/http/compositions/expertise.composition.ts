import { ExpertiseService } from "../../../application/services/expertise.service";
import {
  IExpertiseRepository,
  ISkillRepository,
} from "../../../domain/repositories";
import { IExpertiseService } from "../../../domain/services";
import { ExpertiseRepository } from "../../../infrastructure/database/repositories/expertise.repository";
import { SkillRepository } from "../../../infrastructure/database/repositories/skill.repository";
import { ExpertiseController } from "../controllers/expertise.controller";

export function createExpertiseController() {
  const expertiseRepository: IExpertiseRepository = new ExpertiseRepository();
  const skillRepository: ISkillRepository = new SkillRepository();
  const expertiseService: IExpertiseService = new ExpertiseService(
    expertiseRepository,
    skillRepository,
  );

  return new ExpertiseController(expertiseService);
}

import type {
	IExpertiseRepository,
	IMentorRepository,
	ISkillRepository,
} from "../../../domain/repositories";
import { MentorRepository } from "../../../infrastructure/database/repositories";
import { ExpertiseRepository } from "../../../infrastructure/database/repositories/expertise.repository";
import { SkillRepository } from "../../../infrastructure/database/repositories/skill.repository";
import { ExpertiseController } from "../controllers/expertise.controller";
import {
	CreateExpertiseUC,
	CreateSkillUC,
	FetchExpertisesUC,
	FetchSkillsUC,
	FetchSkillsFromMulipleExpertiseUC,
	FindActiveExpertisesAndSkillsUC,
	UpdateExpertiseUC,
	UpdateSkillUC,
	VerifyExpertiseUC,
} from "../../../application/usecases/expertiseMangement";
import {
	ICreateSkillUC,
	IVerifyExpertiseUC,
	IFetchExpertisesUC,
	IFetchSkillsUC,
	IFindActiveExpertisesAndSkillsUC,
	IFetchSkillsFromMulipleExpertiseUC,
	IUpdateExpertiseUC,
	IUpdateSkillUC,
	ICreateExpertiseUC,
} from "../../../domain/useCases/expertiseMangement/index";

export function createExpertiseController() {
	// repositories
	const expertiseRepository: IExpertiseRepository = new ExpertiseRepository();
	const skillRepository: ISkillRepository = new SkillRepository();
	const mentorRepository: IMentorRepository = new MentorRepository();
	// usecases
	const createExpertiseUC: ICreateExpertiseUC = new CreateExpertiseUC(
		expertiseRepository,
		skillRepository,
	);
	const createSkillUC: ICreateSkillUC = new CreateSkillUC(skillRepository);
	const fetchExpertisesUC: IFetchExpertisesUC = new FetchExpertisesUC(
		expertiseRepository,
	);
	const fetchSkillsUC: IFetchSkillsUC = new FetchSkillsUC(skillRepository);
	const fetchSkillsFromMulipleExpertiseUC: IFetchSkillsFromMulipleExpertiseUC =
		new FetchSkillsFromMulipleExpertiseUC(skillRepository);
	const findActiveExpertisesAndSkillsUC: IFindActiveExpertisesAndSkillsUC =
		new FindActiveExpertisesAndSkillsUC(mentorRepository);
	const updateExpertiseUC: IUpdateExpertiseUC = new UpdateExpertiseUC(
		expertiseRepository,
	);
	const updateSkillUC: IUpdateSkillUC = new UpdateSkillUC(skillRepository);
	const verifyExpertiseUC: IVerifyExpertiseUC = new VerifyExpertiseUC(
		expertiseRepository,
		skillRepository,
	);

	return new ExpertiseController(
		createExpertiseUC,
		createSkillUC,
		fetchExpertisesUC,
		fetchSkillsUC,
		fetchSkillsFromMulipleExpertiseUC,
		findActiveExpertisesAndSkillsUC,
		updateExpertiseUC,
		updateSkillUC,
		verifyExpertiseUC,
	);
}

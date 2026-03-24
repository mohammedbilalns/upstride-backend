import { inject, injectable } from "inversify";
import { Skill } from "../../../../domain/entities/skill.entity";
import type {
	IInterestRepository,
	ISkillRepository,
} from "../../../../domain/repositories";
import { CatalogLimits } from "../../../../shared/constants/app.constants";
import { TYPES } from "../../../../shared/types/types";
import { createUniqueSlug } from "../../../shared/utilities/slug.util";
import type { AddSkillInput } from "../dtos/add-skill.dto";
import { CatalogLimitExceededError } from "../errors/catalog-limit-exceeded.error";
import { InterestNotFound } from "../errors/interest-not-found.error";
import { SkillConflictError } from "../errors/skill-conflict.error";
import type { IAddSkillUseCase } from "./add-skill.usecase.interface";

@injectable()
export class AddSkillUseCase implements IAddSkillUseCase {
	constructor(
		@inject(TYPES.Repositories.SkillRepository)
		private readonly _skillRepository: ISkillRepository,
		@inject(TYPES.Repositories.InterestRepository)
		private readonly _interestRepository: IInterestRepository,
	) {}

	async execute(input: AddSkillInput): Promise<void> {
		const name = input.name.trim();
		const interest = await this._interestRepository.findById(input.interestId);

		if (!interest) {
			throw new InterestNotFound();
		}

		const skillsInInterest = await this._skillRepository.query({
			query: { interestId: input.interestId },
		});
		if (skillsInInterest.length >= CatalogLimits.MAX_SKILLS_PER_INTEREST) {
			throw new CatalogLimitExceededError(
				`Maximum limit of ${CatalogLimits.MAX_SKILLS_PER_INTEREST} skills for this interest reached`,
			);
		}

		const existingByName = await this._skillRepository.query({
			query: { name, interestId: input.interestId },
		});

		if (existingByName.length > 0) {
			throw new SkillConflictError(
				`Skill with name "${name}" already exists in this interest`,
			);
		}

		const slug = await createUniqueSlug(name, async (s: string) => {
			const existing = await this._skillRepository.query({
				query: { slug: s },
			});
			return !existing.some((skill) => skill.slug === s);
		});

		await this._skillRepository.create(
			new Skill("", name, slug, input.interestId, true, new Date(), new Date()),
		);
	}
}

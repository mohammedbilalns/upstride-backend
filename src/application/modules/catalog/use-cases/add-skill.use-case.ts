import { inject, injectable } from "inversify";
import { Skill } from "../../../../domain/entities/skill.entity";
import type {
	IInterestRepository,
	ISkillRepository,
} from "../../../../domain/repositories";
import { CatalogLimits } from "../../../../shared/constants/app.constants";
import { TYPES } from "../../../../shared/types/types";
import { toTitleCase } from "../../../../shared/utilities/to-title-case.util";
import { createUniqueSlug } from "../../../shared/utilities/slug.util";
import type { AddSkillInput, AddSkillOutput } from "../dtos/add-skill.dto";
import { CatalogLimitExceededError } from "../errors/catalog-limit-exceeded.error";
import { InterestNotFound } from "../errors/interest-not-found.error";
import { SkillConflictError } from "../errors/skill-conflict.error";
import type { IAddSkillUseCase } from "./add-skill.use-case.interface";

@injectable()
export class AddSkillUseCase implements IAddSkillUseCase {
	constructor(
		@inject(TYPES.Repositories.SkillRepository)
		private readonly _skillRepository: ISkillRepository,
		@inject(TYPES.Repositories.InterestRepository)
		private readonly _interestRepository: IInterestRepository,
	) {}

	async execute(input: AddSkillInput): Promise<AddSkillOutput> {
		const name = toTitleCase(input.name);
		const interest = await this._interestRepository.findById(input.interestId);

		if (!interest) {
			throw new InterestNotFound();
		}

		const [skillsCountInInterest, existingByName] = await Promise.all([
			this._skillRepository.countByInterestId(input.interestId),
			this._skillRepository.query({
				query: { name, interestId: input.interestId },
			}),
		]);

		if (skillsCountInInterest >= CatalogLimits.MAX_SKILLS_PER_INTEREST) {
			throw new CatalogLimitExceededError(
				`Maximum limit of ${CatalogLimits.MAX_SKILLS_PER_INTEREST} skills for this interest reached`,
			);
		}

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

		const created = await this._skillRepository.create(
			new Skill("", name, slug, input.interestId, true, new Date(), new Date()),
		);

		return {
			name,
			newSkillId: created.id,
			interestId: created.interestId,
			slug: created.slug,
		};
	}
}

import { inject, injectable } from "inversify";
import { Interest } from "../../../../domain/entities/interest.entity";
import type { IInterestRepository } from "../../../../domain/repositories";
import { CatalogLimits } from "../../../../shared/constants/app.constants";
import { TYPES } from "../../../../shared/types/types";
import { toTitleCase } from "../../../../shared/utilities/to-title-case.util";
import { createUniqueSlug } from "../../../shared/utilities/slug.util";
import type {
	AddInterestInput,
	AddInterestOutput,
} from "../dtos/add-interest.dto";
import { CatalogLimitExceededError } from "../errors/catalog-limit-exceeded.error";
import { InterestConflictError } from "../errors/interest-conflict.error";
import type { IAddInterestUseCase } from "./add-interest.use-case.interface";

@injectable()
export class AddInterestUseCase implements IAddInterestUseCase {
	constructor(
		@inject(TYPES.Repositories.InterestRepository)
		private readonly _interestRepository: IInterestRepository,
	) {}

	async execute(input: AddInterestInput): Promise<AddInterestOutput> {
		const name = toTitleCase(input.name);
		const totalInterests = await this._interestRepository.query({ query: {} });
		if (totalInterests.length >= CatalogLimits.MAX_TOTAL_INTERESTS) {
			throw new CatalogLimitExceededError(
				`Maximum limit of ${CatalogLimits.MAX_TOTAL_INTERESTS} interests reached`,
			);
		}

		const existingByName = await this._interestRepository.query({
			query: { name },
		});

		if (existingByName.length > 0) {
			throw new InterestConflictError(
				`Interest with name "${name}" already exists`,
			);
		}

		const slug = await createUniqueSlug(name, async (s: string) => {
			const existing = await this._interestRepository.query({
				query: { slug: s },
			});
			return !existing.some((interest) => interest.slug === s);
		});

		const created = await this._interestRepository.create(
			new Interest("", name, slug, true, new Date(), new Date()),
		);

		return { name, newInterestId: created.id, slug: created.slug };
	}
}

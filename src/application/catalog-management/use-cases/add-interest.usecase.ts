import { inject, injectable } from "inversify";
import { Interest } from "../../../domain/entities/interest.entity";
import type { IInterestRepository } from "../../../domain/repositories";
import { TYPES } from "../../../shared/types/types";
import { createUniqueSlug } from "../../shared/utilities/slug.util";
import type { AddInterestInput } from "../dtos/add-interest.dto";
import type { IAddInterestUseCase } from "./add-interest.usecase.interface";

@injectable()
export class AddInterestUseCase implements IAddInterestUseCase {
	constructor(
		@inject(TYPES.Repositories.InterestRepository)
		private readonly _interestRepository: IInterestRepository,
	) {}

	async execute(input: AddInterestInput): Promise<void> {
		const name = input.name.trim();

		const slug = await createUniqueSlug(name, async (s: string) => {
			const existing = await this._interestRepository.query({
				query: { slug: s },
			});
			return !existing.some((interest) => interest.slug === s);
		});

		await this._interestRepository.create(
			new Interest("", name, slug, true, new Date(), new Date()),
		);
	}
}

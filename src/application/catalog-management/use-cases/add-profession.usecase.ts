import { inject, injectable } from "inversify";
import { Profession } from "../../../domain/entities/profession.entity";
import type { IProfessionRepository } from "../../../domain/repositories/profession.repository.interface";
import { TYPES } from "../../../shared/types/types";
import { createUniqueSlug } from "../../shared/utilities/slug.util";
import type { AddProfessionInput } from "../dtos/add-profession.dto";
import { ProfessionConflictError } from "../errors/profession-conflict.error";
import type { IAddProfessionUseCase } from "./add-profession.usecase.interface";

@injectable()
export class AddProfessionUseCase implements IAddProfessionUseCase {
	constructor(
		@inject(TYPES.Repositories.ProfessionRepository)
		private readonly _professionRepository: IProfessionRepository,
	) {}

	async execute(input: AddProfessionInput): Promise<void> {
		const name = input.name.trim();

		const existingByName = await this._professionRepository.query({
			query: { name },
		});

		if (existingByName.length > 0) {
			throw new ProfessionConflictError(
				`Profession with name "${name}" already exists`,
			);
		}

		const slug = await createUniqueSlug(name, async (s: string) => {
			const existing = await this._professionRepository.query({
				query: { slug: s },
			});
			return !existing.some((p) => p.slug === s);
		});

		await this._professionRepository.create(
			new Profession("", name, slug, true),
		);
	}
}

import { inject, injectable } from "inversify";
import type { IProfessionRepository } from "../../../domain/repositories";
import { TYPES } from "../../../shared/types/types";
import type { EnableProfessionInput } from "../dtos/enable-profession.dto";
import type { IEnableProfessionUseCase } from "./enable-profession.usecase.interface";

@injectable()
export class EnableProfessionUseCase implements IEnableProfessionUseCase {
	constructor(
		@inject(TYPES.Repositories.ProfessionRepository)
		private readonly _professionRepository: IProfessionRepository,
	) {}

	async execute(input: EnableProfessionInput): Promise<void> {
		await this._professionRepository.enable(input.professionId);
	}
}

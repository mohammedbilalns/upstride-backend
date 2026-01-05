import { IExpertiseRepository } from "../../../domain/repositories";
import { IUpdateExpertiseUC } from "../../../domain/useCases/expertiseMangement/updateExpertise.uc.interface";
import { updateExpertiseDto } from "../../dtos";

export class UpdateExpertiseUC implements IUpdateExpertiseUC {
	constructor(private _expertiseRepository: IExpertiseRepository) {}

	async execute(dto: updateExpertiseDto): Promise<void> {
		const updateData: Partial<Omit<updateExpertiseDto, "expertiseId">> = {};
		if (dto.name) updateData.name = dto.name;
		if (dto.description) updateData.description = dto.description;
		if (dto.isVerified) updateData.isVerified = dto.isVerified;

		await this._expertiseRepository.update(dto.expertiseId, updateData);
	}
}

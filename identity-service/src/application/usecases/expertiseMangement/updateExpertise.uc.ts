import { IExpertiseRepository } from "../../../domain/repositories";
import { IUpdateExpertiseUC } from "../../../domain/useCases/expertiseMangement/updateExpertise.uc.interface";
import { updateExpertiseDto } from "../../dtos";

export class UpdateExpertiseUC implements IUpdateExpertiseUC {
	constructor(private _expertiseRepository: IExpertiseRepository) {}

	async execute(data: updateExpertiseDto): Promise<void> {
		const updateData: Partial<Omit<updateExpertiseDto, "expertiseId">> = {};
		if (data.name) updateData.name = data.name;
		if (data.description) updateData.description = data.description;
		if (data.isVerified) updateData.isVerified = data.isVerified;

		await this._expertiseRepository.update(data.expertiseId, updateData);
	}
}

import { createExpertiseDto } from "../../../application/dtos";

export interface ICreateExpertiseUC {
	execute(dto: createExpertiseDto): Promise<void>;
}

import { createExpertiseDto } from "../../../application/dtos";

export interface ICreateExpertiseUC {
	execute(data: createExpertiseDto): Promise<void>;
}

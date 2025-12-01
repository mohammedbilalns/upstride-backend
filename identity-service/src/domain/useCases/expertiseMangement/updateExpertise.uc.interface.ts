import { updateExpertiseDto } from "../../../application/dtos";

export interface IUpdateExpertiseUC {
	execute(data: updateExpertiseDto): Promise<void>;
}

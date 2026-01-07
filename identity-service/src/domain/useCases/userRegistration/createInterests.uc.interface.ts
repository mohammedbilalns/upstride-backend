import { CreateInterestsDto } from "../../../application/dtos/registration.dto";
import { LoginReturn } from "../../../application/dtos/auth.dto";

export interface ICreateInterestsUC {
	execute(dto: CreateInterestsDto): Promise<LoginReturn>;
}

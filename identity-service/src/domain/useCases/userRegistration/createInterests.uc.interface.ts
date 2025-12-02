import {
	createInterestsParam,
	LoginReturn,
} from "../../../application/dtos/registration.dto";

export interface ICreateInterestsUC {
	execute(dto: createInterestsParam): Promise<LoginReturn>;
}

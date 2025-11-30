import {
	createInterestsParam,
	LoginReturn,
} from "../../../application/dtos/registration.dto";

export interface ICreateInterestsUC {
	execute(createinterestsParams: createInterestsParam): Promise<LoginReturn>;
}

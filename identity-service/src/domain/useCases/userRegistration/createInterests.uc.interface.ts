import {
	createInterestsParam,
	createInterestsReturn,
} from "../../../application/dtos/registration.dto";

export interface ICreateInterestsUC {
	execute(
		createinterestsParams: createInterestsParam,
	): Promise<createInterestsReturn>;
}

import { updatePasswordParam } from "../../../application/dtos/update-password.dto";

export interface IUpdatePasswordUC {
	execute(dto: updatePasswordParam): Promise<void>;
}

import { updatePasswordParam } from "../../../application/dtos/updatePassword.dto";

export interface IUpdatePasswordUC {
	execute(dto: updatePasswordParam): Promise<void>;
}

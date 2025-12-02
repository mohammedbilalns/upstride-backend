import { verifyResetOtpParam } from "../../../application/dtos/updatePassword.dto";

export interface IVerifyResetOtpUC {
	execute(dto: verifyResetOtpParam): Promise<string>;
}

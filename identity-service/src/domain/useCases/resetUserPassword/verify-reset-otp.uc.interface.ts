import { verifyResetOtpParam } from "../../../application/dtos/update-password.dto";

export interface IVerifyResetOtpUC {
	execute(dto: verifyResetOtpParam): Promise<string>;
}

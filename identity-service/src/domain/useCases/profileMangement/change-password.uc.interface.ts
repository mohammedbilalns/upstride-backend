import { changePasswordDto } from "../../../application/dtos/profile.dto";

export interface IChangePasswordUC {
	execute(userId: string, data: changePasswordDto): Promise<void>;
}

import { updateProfileDto } from "../../../application/dtos/profile.dto";

export interface IUpdateProfileUC {
	execute(userId: string, data: updateProfileDto): Promise<void>;
}

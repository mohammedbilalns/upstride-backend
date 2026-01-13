import { approveMentorDto } from "../../../application/dtos";

export interface IApproveMentorUC {
	execute(dto: approveMentorDto): Promise<void>;
}

import { rejectMentorDto } from "../../../application/dtos";

export interface IRejectMentorUC {
	execute(dto: rejectMentorDto): Promise<void>;
}

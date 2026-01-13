import { updateMentoDto } from "../../../application/dtos";

export interface IUpdateMentorUC {
	execute(dto: updateMentoDto): Promise<void>;
}

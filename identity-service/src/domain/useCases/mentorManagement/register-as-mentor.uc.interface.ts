import { MentorRegistrationDTO } from "../../../application/dtos";

export interface IRegisterAsMentorUC {
	execute(dto: MentorRegistrationDTO): Promise<void>;
}

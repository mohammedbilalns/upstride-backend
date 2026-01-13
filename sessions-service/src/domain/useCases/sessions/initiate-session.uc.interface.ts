import { InitiateSessionDto } from "../../../application/dtos/session.dto";

export interface IInitiateSessionUC {
	execute(dto: InitiateSessionDto): Promise<void>;
}

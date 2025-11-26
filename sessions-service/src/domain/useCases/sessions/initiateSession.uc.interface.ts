import { initiateSessionDto } from "../../../application/dtos/session.dto";

export interface IInitiateSessionUC {
	execute(dto: initiateSessionDto): Promise<void>;
}

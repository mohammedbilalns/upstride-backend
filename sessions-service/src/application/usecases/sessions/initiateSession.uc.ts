import { IInitiateSessionUC } from "../../../domain/useCases/sessions/initiateSession.uc.interface";
import { initiateSessionDto } from "../../dtos/session.dto";

export class InitiateSessionUC implements IInitiateSessionUC {
	async execute(dto: initiateSessionDto): Promise<void> {
		console.log(dto);
		//TODO: implement
	}
}

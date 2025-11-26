import { IMarkSessionAsCompleteUC } from "../../../domain/useCases/sessions/markSessionAsComplete.uc.interface";
import { markSessionAsCompleteDto } from "../../dtos/session.dto";

export class MarkSessionAsCompleteUC implements IMarkSessionAsCompleteUC {
	async execute(dto: markSessionAsCompleteDto): Promise<void> {
		console.log(dto);
		//TODO: implement
	}
}

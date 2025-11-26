import { markSessionAsCompleteDto } from "../../../application/dtos/session.dto";

export interface IMarkSessionAsCompleteUC {
	execute(dto: markSessionAsCompleteDto): Promise<void>;
}

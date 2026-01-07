import { MarkSessionAsCompleteDto } from "../../../application/dtos/session.dto";

export interface IMarkSessionAsCompleteUC {
	execute(dto: MarkSessionAsCompleteDto): Promise<void>;
}

import type { MarkMessageAsReadDto } from "../../application/dtos/mark-message-as-read.dto";

export interface IMarkMessageAsReadUC {
	execute(dto: MarkMessageAsReadDto): Promise<void>;
}

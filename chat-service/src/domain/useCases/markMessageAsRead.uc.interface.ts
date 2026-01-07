import type { MarkMessageAsReadDto } from "../../application/dtos/markMessageAsRead.dto";

export interface IMarkMessageAsReadUC {
	execute(dto: MarkMessageAsReadDto): Promise<void>;
}

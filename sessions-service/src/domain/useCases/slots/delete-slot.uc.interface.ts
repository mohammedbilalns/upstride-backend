import { DeleteSlotDto } from "../../../application/dtos/slot.dto";

export interface IDeleteSlotUC {
	execute(dto: DeleteSlotDto): Promise<void>;
}

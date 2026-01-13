import { CancelSlotDto } from "../../../application/dtos/slot.dto";

export interface ICancleSlotUC {
	execute(dto: CancelSlotDto): Promise<void>;
}

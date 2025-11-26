import { cancelSlotDto } from "../../../application/dtos/slot.dto";

export interface ICancleSlotUC {
	execute(dto: cancelSlotDto): Promise<void>;
}

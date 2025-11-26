import { createCustomSlotDto } from "../../../application/dtos/slot.dto";

export interface ICreateCustomSlotUC {
	execute(dto: createCustomSlotDto): Promise<void>;
}

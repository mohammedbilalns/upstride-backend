import { CreateCustomSlotDto } from "../../../application/dtos/slot.dto";

export interface ICreateCustomSlotUC {
	execute(dto: CreateCustomSlotDto): Promise<void>;
}

import { ICreateCustomSlotUC } from "../../../domain/useCases/slots/createCustomSlot.uc.interface";
import { createCustomSlotDto } from "../../dtos/slot.dto";

export class CreateCustomSlot implements ICreateCustomSlotUC {
	async execute(dto: createCustomSlotDto): Promise<void> {
		console.log(dto);
		//TODO: implement
	}
}

import { ICancleSlotUC } from "../../../domain/useCases/slots/cancelSlot.uc.interface";
import { cancelSlotDto } from "../../dtos/slot.dto";

export class CancelSlotUC implements ICancleSlotUC {
	async execute(dto: cancelSlotDto): Promise<void> {
		console.log(dto);
		//TODO: implement
	}
}

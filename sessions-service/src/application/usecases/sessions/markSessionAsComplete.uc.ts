import { SlotStatus } from "../../../domain/entities/slot.entity";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { IMarkSessionAsCompleteUC } from "../../../domain/useCases/sessions/markSessionAsComplete.uc.interface";
import { MarkSessionAsCompleteDto } from "../../dtos/session.dto";

export class MarkSessionAsCompleteUC implements IMarkSessionAsCompleteUC {
	constructor(private _slotRepository: ISlotRepository) {}

	async execute(dto: MarkSessionAsCompleteDto): Promise<void> {
		this._slotRepository.update(dto.sessionId, {
			status: SlotStatus.COMPLETED,
		});
	}
}

import { SlotStatus } from "../../../domain/entities/slot.entity";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { IMarkSessionAsCompleteUC } from "../../../domain/useCases/sessions/markSessionAsComplete.uc.interface";
import { markSessionAsCompleteDto } from "../../dtos/session.dto";

export class MarkSessionAsCompleteUC implements IMarkSessionAsCompleteUC {
	constructor(private _slotRepository: ISlotRepository) {}

	async execute(dto: markSessionAsCompleteDto): Promise<void> {
		const { sessionId } = dto;
		this._slotRepository.update(sessionId, { status: SlotStatus.COMPLETED });
	}
}

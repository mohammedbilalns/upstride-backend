import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { QueueEvents } from "../../../common/enums/queueEvents";
import { SlotStatus } from "../../../domain/entities/slot.entity";
import { IEventBus } from "../../../domain/events/eventBus.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { IMarkSessionAsCompleteUC } from "../../../domain/useCases/sessions/markSessionAsComplete.uc.interface";
import { MarkSessionAsCompleteDto } from "../../dtos/session.dto";
import { AppError } from "../../errors/AppError";

export class MarkSessionAsCompleteUC implements IMarkSessionAsCompleteUC {
	constructor(
		private _slotRepository: ISlotRepository,
		private _eventBus: IEventBus,
	) {}

	async execute(dto: MarkSessionAsCompleteDto): Promise<void> {
		const session = await this._slotRepository.findById(dto.sessionId);
		if (!session) {
			throw new AppError(ErrorMessage.SESSION_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		await Promise.all([
			this._slotRepository.update(dto.sessionId, {
				status: SlotStatus.COMPLETED,
			}),
			this._eventBus.publish(QueueEvents.COMPLETED_SESSION, {
				sessionId: session.id,
				mentorId: session.mentorId,
				participantId: session.participantId,
			}),
			this._eventBus.publish(QueueEvents.SEND_NOTIFICATION, {
				userId: session.participantId,
				type: "COMPLETED_SESSION",
				triggeredBy: session.mentorId,
				targetResource: session.id,
				message: "Session marked as complete",
			}),
		]);
	}
}

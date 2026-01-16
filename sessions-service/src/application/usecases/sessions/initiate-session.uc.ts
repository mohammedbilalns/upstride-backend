import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { QueueEvents } from "../../../common/enums/queue-events";
import { SlotStatus } from "../../../domain/entities/slot.entity";
import { IEventBus } from "../../../domain/events/eventBus.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { IInitiateSessionUC } from "../../../domain/useCases/sessions/initiate-session.uc.interface";
import { InitiateSessionDto } from "../../dtos/session.dto";
import { AppError } from "../../errors/app-error";

export class InitiateSessionUC implements IInitiateSessionUC {
	constructor(
		private _slotRepository: ISlotRepository,
		private _eventBus: IEventBus,
	) { }

	/**
	 * Initiates a session.
	 * 1. Updates slot status to STARTED.
	 * 2. Emits STARTED_SESSION event.
	 * 3. Sends notification to participant.
	 */
	async execute(dto: InitiateSessionDto): Promise<void> {
		const session = await this._slotRepository.findById(dto.sessionId);
		if (!session)
			throw new AppError(
				ErrorMessage.SESSION_NOT_FOUND,
				HttpStatus.BAD_REQUEST,
			);

		await Promise.all([
			// update the slot status
			this._slotRepository.update(dto.sessionId, {
				status: SlotStatus.STARTED,
			}),
			// Emitting STARTED_SESSION with details for Gateway to create room/signal users
			this._eventBus.publish(QueueEvents.STARTED_SESSION, {
				sessionId: session.id,
				mentorId: session.mentorId,
				userId: session.participantId,
			}),
			// send notification to the user
			this._eventBus.publish(QueueEvents.SEND_NOTIFICATION, {
				userId: session.participantId,
				type: "STARTED_SESSION",
				triggeredBy: session.mentorId,
				targetResource: session.id,
			}),
		]);
	}
}

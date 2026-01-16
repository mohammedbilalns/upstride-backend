import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { IJoinSessionUC } from "../../../domain/useCases/sessions/join-session.uc.interface";
import { AppError } from "../../errors/app-error";

export class JoinSessionUC implements IJoinSessionUC {
    constructor(private _slotRepository: ISlotRepository) { }

    async execute(userId: string, sessionId: string): Promise<void> {
        const slot = await this._slotRepository.findById(sessionId);
        if (!slot) {
            throw new AppError(ErrorMessage.SESSION_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        // Check if user is participant or mentor
        if (slot.participantId !== userId && slot.mentorId !== userId) {
            throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
        }


        const now = new Date();
        const joinTime = new Date(slot.startAt.getTime() - 1 * 60 * 1000); // 1 minute before

        if (now < joinTime) {
            throw new AppError("Session has not started yet. You can join 1 minute before start.", HttpStatus.BAD_REQUEST);
        }
    }
}

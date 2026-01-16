import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { BookingStatus } from "../../../domain/entities/booking.entity";
import { SlotStatus } from "../../../domain/entities/slot.entity";
import { IBookingRepository } from "../../../domain/repositories/booking.repository.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { AppError } from "../../errors/app-error";

interface CancelReservationDto {
    userId: string;
    slotId: string;
}

export class CancelReservationUc {
    constructor(
        private _bookingRepository: IBookingRepository,
        private _slotRepository: ISlotRepository,
    ) { }

    async execute(dto: CancelReservationDto): Promise<void> {
        const slot = await this._slotRepository.findById(dto.slotId);
        if (!slot) {
            throw new AppError(ErrorMessage.SLOT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (slot.participantId !== dto.userId) {
            throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
        }

        if (slot.status !== SlotStatus.RESERVED) {
            // If it's already OPEN, 
            if (slot.status === SlotStatus.OPEN) return;
            throw new AppError("Slot is not in reserved state", HttpStatus.BAD_REQUEST);
        }

        // Update Slot to OPEN
        await this._slotRepository.update(slot.id, {
            status: SlotStatus.OPEN,
            participantId: null as any
        });

        // Cancel Booking
        const booking = await this._bookingRepository.findBySlotId(slot.id);
        if (booking && booking.status === BookingStatus.PENDING) {
            await this._bookingRepository.update(booking.id, {
                status: BookingStatus.CANCELLED,
            });
        }
    }
}

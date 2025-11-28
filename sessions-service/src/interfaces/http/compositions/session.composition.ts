import { BookSessionUc } from "../../../application/usecases/bookings/bookSession.uc";
import { CancelBookingUC } from "../../../application/usecases/bookings/cancelBooking.uc";
import { InitiateSessionUC } from "../../../application/usecases/sessions/initiateSession.uc";
import { MarkSessionAsCompleteUC } from "../../../application/usecases/sessions/markSessionAsComplete.uc";
import { SessionController } from "../controllers/session.controller";
import EventBus from "../../../infrastructure/events/eventBus";
import { SlotRepository } from "../../../infrastructure/database/repositories/slot.repository";
import { BookingRepository } from "../../../infrastructure/database/repositories/booking.repository";

export function createSessionController() {
	// repository
	const slotRepository = new SlotRepository();
	const bookingRepository = new BookingRepository();

	// usecases
	const initiateSessionUC = new InitiateSessionUC(slotRepository, EventBus);
	const markSessionAsCompleteUC = new MarkSessionAsCompleteUC(slotRepository);
	const bookSessionUC = new BookSessionUc(bookingRepository, slotRepository);
	const cancelBookingUC = new CancelBookingUC(
		bookingRepository,
		slotRepository,
	);

	return new SessionController(
		initiateSessionUC,
		markSessionAsCompleteUC,
		bookSessionUC,
		cancelBookingUC,
	);
}

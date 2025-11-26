import { BookSessionUc } from "../../../application/usecases/bookings/bookSession.uc";
import { CancelBookingUC } from "../../../application/usecases/bookings/cancelBooking.uc";
import { InitiateSessionUC } from "../../../application/usecases/sessions/initiateSession.uc";
import { MarkSessionAsCompleteUC } from "../../../application/usecases/sessions/markSessionAsComplete.uc";
import { SessionController } from "../controllers/session.controller";

export function createSessionController() {
	// repository
	// usecases
	const initiateSessionUC = new InitiateSessionUC();
	const markSessionAsCompleteUC = new MarkSessionAsCompleteUC();
	const bookSessionUC = new BookSessionUc();
	const cancelBookingUC = new CancelBookingUC();

	return new SessionController(
		initiateSessionUC,
		markSessionAsCompleteUC,
		bookSessionUC,
		cancelBookingUC,
	);
}

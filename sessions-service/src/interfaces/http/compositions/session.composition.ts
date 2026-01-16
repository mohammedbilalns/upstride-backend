import { BookSessionUc } from "../../../application/usecases/bookings/book-session.uc";
import { CancelBookingUC } from "../../../application/usecases/bookings/cancel-booking.uc";
import { InitiateSessionUC } from "../../../application/usecases/sessions/initiate-session.uc";
import { MarkSessionAsCompleteUC } from "../../../application/usecases/sessions/mark-session-as-complete.uc";
import { GetSessionsUC } from "../../../application/usecases/sessions/get-sessions.uc";
import { GetSessionsListUC } from "../../../application/usecases/sessions/get-sessions-list.uc";
import { JoinSessionUC } from "../../../application/usecases/sessions/join-session.uc";
import { RequestRescheduleUC } from "../../../application/usecases/bookings/request-reschedule.uc";
import { HandleRescheduleUC } from "../../../application/usecases/bookings/handle-reschedule.uc";
import { CancelReservationUc } from "../../../application/usecases/bookings/cancel-reservation.uc";
import { SessionController } from "../controllers/session.controller";
import EventBus from "../../../infrastructure/events/eventBus";
import { SlotRepository } from "../../../infrastructure/database/repositories/slot.repository";
import { BookingRepository } from "../../../infrastructure/database/repositories/booking.repository";

import { RedisCacheService } from "../../../infrastructure/services/cache.service";
import { UserService } from "../../../infrastructure/external/user.service";
import { PaymentService } from "../../../infrastructure/external/payment.service";
import { MentorService } from "../../../infrastructure/external/mentor.service";

export function createSessionController() {
	// repository
	const slotRepository = new SlotRepository();
	const bookingRepository = new BookingRepository();

	// External Services
	const cacheService = new RedisCacheService();
	const userService = new UserService(cacheService);
	const paymentService = new PaymentService(cacheService);
	const mentorService = new MentorService(cacheService);

	// usecases
	const initiateSessionUC = new InitiateSessionUC(slotRepository, EventBus);
	const markSessionAsCompleteUC = new MarkSessionAsCompleteUC(
		slotRepository,
		EventBus,
	);
	const bookSessionUC = new BookSessionUc(bookingRepository, slotRepository);
	const cancelBookingUC = new CancelBookingUC(
		bookingRepository,
		slotRepository,
		EventBus,
	);
	const getSessionsUC = new GetSessionsUC(
		bookingRepository,
		userService,
		paymentService,
	);
	const requestRescheduleUC = new RequestRescheduleUC(
		bookingRepository,
		slotRepository,
	);
	const handleRescheduleUC = new HandleRescheduleUC(
		bookingRepository,
		slotRepository,
	);
	const cancelReservationUC = new CancelReservationUc(
		bookingRepository,
		slotRepository,
	);
	const getSessionsListUC = new GetSessionsListUC(
		bookingRepository,
		userService,
		paymentService,
		mentorService
	);
	const joinSessionUC = new JoinSessionUC(slotRepository);

	return new SessionController(
		initiateSessionUC,
		markSessionAsCompleteUC,
		bookSessionUC,
		cancelBookingUC,
		getSessionsUC,
		requestRescheduleUC,
		handleRescheduleUC,
		cancelReservationUC,
		getSessionsListUC,
		joinSessionUC
	);
}

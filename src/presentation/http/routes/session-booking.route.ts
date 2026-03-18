import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { SessionBookingController } from "../controllers/session-booking.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	bookingIdParamSchema,
	bookingListQuerySchema,
	bookSessionBodySchema,
	handleRescheduleBodySchema,
} from "../validators/session-booking.validator";

const sessionBookingRouter = Router();
const sessionBookingController = container.get<SessionBookingController>(
	TYPES.Controllers.SessionBooking,
);

sessionBookingRouter.post(
	ROUTES.SESSION_BOOKINGS.BOOK,
	verifySession,
	authorizeRoles(["USER", "MENTOR"]),
	validate({ body: bookSessionBodySchema }),
	sessionBookingController.bookSession,
);

sessionBookingRouter.patch(
	ROUTES.SESSION_BOOKINGS.CANCEL(":bookingId"),
	verifySession,
	authorizeRoles(["USER", "MENTOR"]),
	validate({ params: bookingIdParamSchema }),
	sessionBookingController.cancelBooking,
);

sessionBookingRouter.patch(
	ROUTES.SESSION_BOOKINGS.MENTOR_CANCEL(":bookingId"),
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ params: bookingIdParamSchema }),
	sessionBookingController.cancelBookingByMentor,
);

sessionBookingRouter.patch(
	ROUTES.SESSION_BOOKINGS.REQUEST_RESCHEDULE(":bookingId"),
	verifySession,
	authorizeRoles(["USER", "MENTOR"]),
	validate({ params: bookingIdParamSchema }),
	sessionBookingController.requestReschedule,
);

sessionBookingRouter.patch(
	ROUTES.SESSION_BOOKINGS.HANDLE_RESCHEDULE(":bookingId"),
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ params: bookingIdParamSchema, body: handleRescheduleBodySchema }),
	sessionBookingController.handleReschedule,
);

sessionBookingRouter.get(
	ROUTES.SESSION_BOOKINGS.USER,
	verifySession,
	authorizeRoles(["USER", "MENTOR"]),
	validate({ query: bookingListQuerySchema }),
	sessionBookingController.getUserBookings,
);

sessionBookingRouter.get(
	ROUTES.SESSION_BOOKINGS.MENTOR,
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ query: bookingListQuerySchema }),
	sessionBookingController.getMentorBookings,
);

export { sessionBookingRouter };

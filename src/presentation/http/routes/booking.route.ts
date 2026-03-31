import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { BookingController } from "../controllers/booking.controller";
import { authorizeRoles, verifySession } from "../middlewares";
import {
	bookingDetailsSchema,
	bookingListSchema,
	cancelBookingSchema,
	createBookingSchema,
	repayBookingSchema,
} from "../validators/booking.validator";

const bookingRouter = Router();
const bookingController = container.get<BookingController>(
	TYPES.Controllers.Booking,
);

import { validate } from "../middlewares";
import { getAvailableSlotsSchema } from "../validators/booking.validator";

bookingRouter.get(
	ROUTES.BOOKINGS.SLOTS(":mentorId"),
	verifySession,
	validate(getAvailableSlotsSchema),
	bookingController.getAvailableSlots,
);

bookingRouter.post(
	ROUTES.BOOKINGS.ROOT,
	verifySession,
	validate(createBookingSchema),
	bookingController.createBooking,
);

bookingRouter.put(
	ROUTES.BOOKINGS.CANCEL(":id"),
	verifySession,
	validate(cancelBookingSchema),
	bookingController.cancelBooking,
);

bookingRouter.put(
	ROUTES.BOOKINGS.MENTOR_CANCEL(":id"),
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate(cancelBookingSchema),
	bookingController.cancelBookingByMentor,
);

bookingRouter.post(
	ROUTES.BOOKINGS.REPAY(":id"),
	verifySession,
	validate(repayBookingSchema),
	bookingController.repayBooking,
);

bookingRouter.get(
	ROUTES.BOOKINGS.USER,
	verifySession,
	validate(bookingListSchema),
	bookingController.getUserBookings,
);

bookingRouter.get(
	ROUTES.BOOKINGS.BY_ID(":id"),
	verifySession,
	validate(bookingDetailsSchema),
	bookingController.getBookingDetails,
);

bookingRouter.get(
	ROUTES.BOOKINGS.MENTOR,
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate(bookingListSchema),
	bookingController.getMentorBookings,
);

export { bookingRouter };

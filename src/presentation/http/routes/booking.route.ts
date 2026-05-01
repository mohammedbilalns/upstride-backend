import { Router } from "express";
import { apiContainer } from "../../../main/di/api.container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { BookingController } from "../controllers/booking.controller";
import { authorizeRoles, verifySession } from "../middlewares";
import {
	BookingDetailsParamsSchema,
	BookingListQuerySchema,
	CancelBookingParamsSchema,
	CancellBookingBodySchema,
	CreateBookingBodySchema,
	GetAvaialableSlotsParamsSchema,
	GetAvailableSlotsQuerySchema,
	RepayBookingParamsSchema,
	RescheduleBookingBodySchema,
	RescheduleBookingParamsSchema,
} from "../validators/booking.validator";

const bookingRouter = Router();
const bookingController = apiContainer.get<BookingController>(
	TYPES.Controllers.Booking,
);

import { validate } from "../middlewares";
import { FeedBackBodySchema } from "../validators/feedback.validator";

bookingRouter.get(
	ROUTES.BOOKINGS.SLOTS(":mentorId"),
	verifySession,
	validate({
		params: GetAvaialableSlotsParamsSchema,
		query: GetAvailableSlotsQuerySchema,
	}),
	bookingController.getAvailableSlots,
);

bookingRouter.post(
	ROUTES.BOOKINGS.ROOT,
	verifySession,
	validate({ body: CreateBookingBodySchema }),
	bookingController.createBooking,
);

bookingRouter.put(
	ROUTES.BOOKINGS.CANCEL(":id"),
	verifySession,
	validate({
		params: CancelBookingParamsSchema,
		body: CancellBookingBodySchema,
	}),
	bookingController.cancelBooking,
);

bookingRouter.put(
	ROUTES.BOOKINGS.MENTOR_CANCEL(":id"),
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({
		params: CancelBookingParamsSchema,
		body: CancellBookingBodySchema,
	}),
	bookingController.cancelBookingByMentor,
);

bookingRouter.post(
	ROUTES.BOOKINGS.REPAY(":id"),
	verifySession,
	validate({ params: RepayBookingParamsSchema }),
	bookingController.repayBooking,
);

bookingRouter.get(
	ROUTES.BOOKINGS.USER,
	verifySession,
	validate({ query: BookingListQuerySchema }),
	bookingController.getUserBookings,
);

bookingRouter.get(
	ROUTES.BOOKINGS.BY_ID(":id"),
	verifySession,
	validate({ params: BookingDetailsParamsSchema }),
	bookingController.getBookingDetails,
);

bookingRouter.get(
	ROUTES.BOOKINGS.MENTOR,
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ query: BookingListQuerySchema }),
	bookingController.getMentorBookings,
);

bookingRouter.get(
	ROUTES.BOOKINGS.RECEIPT(":id"),
	verifySession,
	bookingController.generateReceiptPdf,
);

bookingRouter.patch(
	ROUTES.BOOKINGS.RESCHEDULE(":id"),
	verifySession,
	validate({
		params: RescheduleBookingParamsSchema,
		body: RescheduleBookingBodySchema,
	}),
	bookingController.rescheduleBooking,
);

bookingRouter.post(
	ROUTES.BOOKINGS.FEEDBACK,
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ body: FeedBackBodySchema }),
	bookingController.feedBackUser,
);

export { bookingRouter };

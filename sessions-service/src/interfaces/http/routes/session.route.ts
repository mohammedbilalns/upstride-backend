import { Router } from "express";
import { createSessionController } from "../compositions/session.composition";

export function createSessionRoutes() {
	const router = Router();
	const sessionsController = createSessionController();

	router.post("/:slotId/booking", sessionsController.bookSession);
	router.post("/bookings/:bookingId/cancel", sessionsController.cancelBooking);
	router.post("/:slotId/start", sessionsController.initiateSession);
	router.post("/:slotId/complete");

	return router;
}

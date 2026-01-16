import { Router } from "express";
import { createSessionController } from "../compositions/session.composition";
import { authMiddleware, authorizeRoles } from "../middlewares";

export function createSessionRoutes() {
	const router = Router();
	const sessionsController = createSessionController();
	// Middleware to authenticate requests
	router.use(authMiddleware(), authorizeRoles("user", "mentor"));

	/**
	 * Retrieves a list of sessions.
	 */
	/**
	 * Retrieves a list of sessions.
	 */
	router.get("/", sessionsController.getSessions);
	router.get("/list", sessionsController.getSessionsList);

	/**
	 * Books a session for a specific slot.
	 */
	router.post("/:slotId/book", sessionsController.bookSession);
	/**
	 * Cancels an existing reservation.
	 */
	router.post("/:slotId/cancel-reservation", sessionsController.cancelReservation);

	/**
	 * Cancels an existing booking.
	 */
	router.post("/:bookingId/cancel", sessionsController.cancelBooking);

	/**
	 * Initiates a session.
	 */
	router.post("/:sessionId/start", sessionsController.initiateSession);

	/**
	 * Joins a session via redirect.
	 */
	router.get("/:sessionId/join", sessionsController.joinSession);

	/**
	 * Marks a session as complete.
	 */
	router.post("/:sessionId/complete", sessionsController.markSessionAsComplete);

	/**
	 * Requests a reschedule for a booking.
	 */
	router.post("/:bookingId/reschedule", sessionsController.requestReschedule);

	/**
	 * Handles a reschedule request (accept/reject).
	 */
	router.post(
		"/:bookingId/reschedule/handle",
		sessionsController.handleReschedule,
	);

	return router;
}

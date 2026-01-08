import { Router } from "express";
import { createSessionController } from "../compositions/session.composition";
import { authMiddleware } from "../middlewares";

export function createSessionRoutes() {
	const router = Router();
	const sessionsController = createSessionController();
	router.use(authMiddleware());

	// TODO: implment route to fetch upcoming past and all sessions
	router.get("/", sessionsController.getSessions);
	router.post("/:slotId/book", sessionsController.bookSession);
	router.post("/:bookingId/cancel", sessionsController.cancelBooking);
	router.post("/:sessionId/start", sessionsController.initiateSession);
	router.post("/:sessionId/complete", sessionsController.markSessionAsComplete);

	return router;
}

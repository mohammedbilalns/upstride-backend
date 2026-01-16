import { Router } from "express";
import { createSlotController } from "../compositions/slot.composition";
import { authMiddleware, authorizeRoles } from "../middlewares";

export function createSlotRoutes() {
	const router = Router();
	const slotsController = createSlotController();

	router.use(authMiddleware());

	/**
	 * Retrieves recurring availability rules for a mentor.
	 */
	router.get("/rules",
		authorizeRoles("mentor"),
		slotsController.getMentorRules
	);

	/**
	 * Updates a specific recurring availability rule.
	 */
	router.patch(
		"/availability/recurring/:ruleId",
		authorizeRoles("mentor"),
		slotsController.updateRecurringRule,
	);

	/**
	 * Creates a new recurring availability rule.
	 */
	router.post(
		"/availability/recurring/create",
		authorizeRoles("mentor"),
		slotsController.addRecurringRule,
	);

	/**
	 * Disables a specific recurring availability rule.
	 */
	router.patch(
		"/availability/recurring/:ruleId/disable",
		authorizeRoles("mentor"),
		slotsController.disableRecurringRule,
	);

	/**
	 * Enables a specific recurring availability rule.
	 */
	router.patch(
		"/availability/recurring/:ruleId/enable",
		authorizeRoles("mentor"),
		slotsController.enableRecurringRule,
	);

	/**
	 * Creates a custom  slot.
	 */
	router.post("/availability/custom", authorizeRoles("mentor"), slotsController.createCustomSlot);

	/**
	 * Deletes a specific recurring availability rule.
	 */
	router.delete(
		"/availability/recurring/:ruleId",
		authorizeRoles("mentor"),
		slotsController.deleteRecurringRule,
	);

	/**
	 * Retrieves slots for a mentor.
	 */
	router.get("/slots", slotsController.getMentorSlots);

	/**
	 * Retrieves available slots for a mentor (public/user facing).
	 */
	router.get("/slots/available", slotsController.getAvailableSlots);

	/**
	 * Cancels a specific slot.
	 */
	router.post("/:slotId/cancel", slotsController.cancelSlot);

	/**
	 * Deletes a specific slot.
	 */
	router.delete("/:slotId", slotsController.deleteSlot);

	return router;
}

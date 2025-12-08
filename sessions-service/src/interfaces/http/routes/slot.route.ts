import { Router } from "express";
import { createSlotController } from "../compositions/slot.composition";
import { authMiddleware } from "../middlewares";

export function createSlotRoutes() {
	const router = Router();
	const slotsController = createSlotController();
	router.use(authMiddleware());

	router.get("/rules/:mentorId", slotsController.getMentorRules);
	// router.post(
	// 	"/:mentorId/availability/recurring",
	// 	slotsController.createRecurringRule,
	// );
	router.patch(
		"/:mentorId/availability/recurring/:ruleId",
		slotsController.updateRecurringRule,
	);
	router.post(
		"/:mentorId/availability/recurring/create",
		slotsController.addRecurringRule,
	);
	router.patch(
		"/:mentorId/availability/recurring/:ruleId/disable",
		slotsController.disableRecurringRule,
	);
	router.post(
		"/:mentorId/availability/custom",
		slotsController.createCustomSlot,
	);
	router.get("/:mentorId/slots", slotsController.getMentorSlots);
	router.post("/:mentorId/:slotId/cancel", slotsController.cancelSlot);

	return router;
}

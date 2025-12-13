import { Router } from "express";
import { createSlotController } from "../compositions/slot.composition";
import { authMiddleware } from "../middlewares";

export function createSlotRoutes() {
	const router = Router();
	const slotsController = createSlotController();
	router.use(authMiddleware());

	router.get("/rules", slotsController.getMentorRules);
	// router.post(
	// 	"/:mentorId/availability/recurring",
	// 	slotsController.createRecurringRule,
	// );
	router.patch(
		"/availability/recurring/:ruleId",
		slotsController.updateRecurringRule,
	);
	router.post(
		"/availability/recurring/create",
		slotsController.addRecurringRule,
	);
	router.patch(
		"/availability/recurring/:ruleId/disable",
		slotsController.disableRecurringRule,
	);
	router.post("/availability/custom", slotsController.createCustomSlot);
	router.delete(
		"/availability/recurring/:ruleId",
		slotsController.deleteRecurringRule,
	);
	router.get("/slots", slotsController.getMentorSlots);
	router.post("/:slotId/cancel", slotsController.cancelSlot);

	return router;
}

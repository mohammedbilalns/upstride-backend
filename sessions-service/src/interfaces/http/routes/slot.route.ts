import { Router } from "express";
import { createSlotController } from "../compositions/slot.composition";

export function createSlotRoutes() {
	const router = Router();
	const slotsController = createSlotController();

	router.post(
		"/:mentorId/availability/recurring",
		slotsController.createRecurringRule,
	);
	router.patch(
		"/:mentorId/availability/recurring/:ruleId",
		slotsController.updateRecurringRule,
	);
	router.post(
		"/:mentorId/availability/recurring/:ruleId/exeption",
		slotsController.addRecurringRule,
	);
	router.patch(
		"/:mentorId/availability/recurring/:ruleId/exeption",
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

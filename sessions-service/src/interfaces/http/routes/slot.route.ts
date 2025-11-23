import { Router } from "express";
import { createSlotController } from "../compositions/slot.composition";

export function createSlotRoutes() {
	const router = Router();
	const slotsController = createSlotController();

	router.post(
		"/:mentorId/availability/recurring",
		slotsController.createRecurringRule,
	);
	router.post(
		"/:mentorId/availability/recurring/:ruleId",
		slotsController.updateRecurringRule,
	);
	router.patch(
		"/:mentorId/availability/recurring/:ruleId/exeption",
		slotsController.disableRecurringRule,
	);
	router.post(
		"/:mentorId/availability/customRanges",
		slotsController.createCustomAvailability,
	);
	router.get("/:mentorId/slots", slotsController.getMentorSlots);
	router.post("/:slotId/cancel", slotsController.cancelSlot);

	return router;
}

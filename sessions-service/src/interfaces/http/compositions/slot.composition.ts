import { AddRecurringRuleUC } from "../../../application/usecases/recurringRule/addRecurringRule.uc";
import { DeleteRecurringRuleUC } from "../../../application/usecases/recurringRule/deleteRecurringRule.uc";
import { DisableRecurringRuleUC } from "../../../application/usecases/recurringRule/disableRecurringRule.uc";
import { EnableRecurringRuleUC } from "../../../application/usecases/recurringRule/enableRecurringRule.uc";
import { GetRuleUC } from "../../../application/usecases/recurringRule/getRule.uc";
import { UpdateRecurringRuleUC } from "../../../application/usecases/recurringRule/updateRecurringRule.uc";
import { CancelSlotUC } from "../../../application/usecases/slots/cancelSlot.uc";
import { GetMentorSlotsUC } from "../../../application/usecases/slots/getMentorSlots.uc";
import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { AvailabilityRepository } from "../../../infrastructure/database/repositories/availability.repository";
import { SlotRepository } from "../../../infrastructure/database/repositories/slot.repository";
import { SlotsController } from "../controllers/slots.controller";

import { GenerateSlotsUC } from "../../../application/usecases/slots/generateSlots.uc";
import { DeleteSlotUC } from "../../../application/usecases/slots/deleteSlot.uc";
import { CreateCustomSlotUC } from "../../../application/usecases/slots/createCustomSlot.uc";

export function createSlotController() {
	// repositiories
	const slotRepository: ISlotRepository = new SlotRepository();
	const availabilityRepository: IAvailabilityRepository =
		new AvailabilityRepository();

	const generateSlotsUC = new GenerateSlotsUC(
		availabilityRepository,
		slotRepository,
	);

	// usecases
	const updateRecurringRuleUC = new UpdateRecurringRuleUC(
		availabilityRepository,
		generateSlotsUC,
		slotRepository,
	);
	const disableRecurringRuleUC = new DisableRecurringRuleUC(
		availabilityRepository,
		slotRepository,
	);

	const enableRecurringRuleUC = new EnableRecurringRuleUC(
		availabilityRepository,
		slotRepository,
	);
	const deleteRecurringRuleUC = new DeleteRecurringRuleUC(
		availabilityRepository,
		slotRepository,
	);
	const addRecurringRuleUC = new AddRecurringRuleUC(
		availabilityRepository,
		generateSlotsUC,
	);
	const createCustomSlotUC = new CreateCustomSlotUC(slotRepository);
	const cancelSlotUC = new CancelSlotUC(slotRepository);

	const getMentorSlotsUC = new GetMentorSlotsUC(slotRepository);
	const getMentorRulesUC = new GetRuleUC(availabilityRepository);

	const deleteSlotUC = new DeleteSlotUC(slotRepository);

	return new SlotsController(
		createCustomSlotUC,
		updateRecurringRuleUC,
		addRecurringRuleUC,
		disableRecurringRuleUC,
		enableRecurringRuleUC,
		deleteRecurringRuleUC,
		getMentorSlotsUC,
		cancelSlotUC,
		deleteSlotUC,
		getMentorRulesUC,
	);
}

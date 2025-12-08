import { AddRecurringRuleUC } from "../../../application/usecases/recurringRule/addRecurringRule.uc";
import { DisableRecurringRuleUC } from "../../../application/usecases/recurringRule/disableRecurringRule.uc";
import { GetRuleUC } from "../../../application/usecases/recurringRule/getRule.uc";
import { UpdateRecurringRuleUC } from "../../../application/usecases/recurringRule/updateRecurringRule.uc";
import { CancelSlotUC } from "../../../application/usecases/slots/cancelSlot.uc";
import { CreateCustomSlot } from "../../../application/usecases/slots/createCustomSlot.uc";
import { GetMentorSlotsUC } from "../../../application/usecases/slots/getMentorSlots.uc";
import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { AvailabilityRepository } from "../../../infrastructure/database/repositories/availability.repository";
import { SlotRepository } from "../../../infrastructure/database/repositories/slot.repository";
import { SlotsController } from "../controllers/slots.controller";

export function createSlotController() {
	// repositiories
	const slotRepository: ISlotRepository = new SlotRepository();
	const availabilityRepository: IAvailabilityRepository =
		new AvailabilityRepository();

	// usecases
	const updateRecurringRuleUC = new UpdateRecurringRuleUC(
		availabilityRepository,
	);
	const disableRecurringRuleUC = new DisableRecurringRuleUC(
		availabilityRepository,
	);
	const addRecurringRuleUC = new AddRecurringRuleUC(availabilityRepository);
	const createCustomSlotUC = new CreateCustomSlot(slotRepository);
	const cancelSlotUC = new CancelSlotUC(slotRepository);

	const getMentorSlotsUC = new GetMentorSlotsUC(slotRepository);
	const getMentorRulesUC = new GetRuleUC(availabilityRepository);

	return new SlotsController(
		createCustomSlotUC,
		updateRecurringRuleUC,
		addRecurringRuleUC,
		disableRecurringRuleUC,
		getMentorSlotsUC,
		cancelSlotUC,
		getMentorRulesUC,
	);
}

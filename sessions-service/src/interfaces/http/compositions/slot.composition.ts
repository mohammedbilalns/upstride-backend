import { AddRecurringRuleUC } from "../../../application/usecases/recurringRule/addRecurringRule.uc";
import { CreateRecurringRuleUC } from "../../../application/usecases/recurringRule/createRecurringRule.uc";
import { DisableRecurringRuleUC } from "../../../application/usecases/recurringRule/disableRecurringRule.uc";
import { UpdateRecurringRuleUC } from "../../../application/usecases/recurringRule/updateRecurringRule.uc";
import { CancelSlotUC } from "../../../application/usecases/slots/cancelSlot.uc";
import { CreateCustomSlot } from "../../../application/usecases/slots/createCustomSlot.uc";
import { GetMentorSlotsUC } from "../../../application/usecases/slots/getMentorSlots.uc";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { SlotRepository } from "../../../infrastructure/database/repositories/slot.repository";
import { SlotsController } from "../controllers/slots.controller";

export function createSlotController() {
	// repositiories
	const slotRepository: ISlotRepository = new SlotRepository();

	// usecases
	const createCustomSlotUC = new CreateCustomSlot();
	const createrecurringRuleUC = new CreateRecurringRuleUC();
	const updateRecurringRuleUC = new UpdateRecurringRuleUC();
	const addRecurringRuleUC = new AddRecurringRuleUC();
	const disableRecurringRuleUC = new DisableRecurringRuleUC();
	const getMentorSlotsUC = new GetMentorSlotsUC(slotRepository);
	const cancelSlotUC = new CancelSlotUC();

	return new SlotsController(
		createCustomSlotUC,
		createrecurringRuleUC,
		updateRecurringRuleUC,
		addRecurringRuleUC,
		disableRecurringRuleUC,
		getMentorSlotsUC,
		cancelSlotUC,
	);
}

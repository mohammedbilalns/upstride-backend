import { AddRecurringRuleUC } from "../../../application/usecases/recurringRule/add-recurring-rule.uc";
import { DeleteRecurringRuleUC } from "../../../application/usecases/recurringRule/delete-recurring-rule.uc";
import { DisableRecurringRuleUC } from "../../../application/usecases/recurringRule/disable-recurring-rule.uc";
import { EnableRecurringRuleUC } from "../../../application/usecases/recurringRule/enable-recurring-rule.uc";
import { GetRuleUC } from "../../../application/usecases/recurringRule/get-rule.uc";
import { UpdateRecurringRuleUC } from "../../../application/usecases/recurringRule/update-recurring-rule.uc";
import { CancelSlotUC } from "../../../application/usecases/slots/cancel-slot.uc";
import { GetMentorSlotsUC } from "../../../application/usecases/slots/get-mentor-slots.uc";
import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { AvailabilityRepository } from "../../../infrastructure/database/repositories/availability.repository";
import { SlotRepository } from "../../../infrastructure/database/repositories/slot.repository";
import { SlotsController } from "../controllers/slots.controller";

import { GenerateSlotsUC } from "../../../application/usecases/slots/generate-slots.uc";
import { DeleteSlotUC } from "../../../application/usecases/slots/delete-slot.uc";
import { CreateCustomSlotUC } from "../../../application/usecases/slots/create-custom-slot.uc";

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

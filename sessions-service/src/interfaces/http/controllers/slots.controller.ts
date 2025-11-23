import { HttpStatus, ResponseMessage } from "../../../common/enums";
import asyncHandler from "../utils/asyncHandler";

export class SlotsController {
	createCustomAvailability = asyncHandler((_req, res) => {
		// TODO: Implement create custom availabity
		res.status(HttpStatus.CREATED).json({
			success: true,
			message: ResponseMessage.CUSTOM_AVAILABILITY_CREATED,
		});
	});

	createRecurringRule = asyncHandler((_req, res) => {
		// TODO: Implement create recurring rule
		res
			.status(HttpStatus.CREATED)
			.json({ success: true, message: ResponseMessage.RECURRING_RULE_CREATED });
	});

	updateRecurringRule = asyncHandler((_req, res) => {
		// TODO: Implement update recurring rule
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.RECURRING_RULE_UPDATED });
	});

	disableRecurringRule = asyncHandler((_req, res) => {
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.DISBLED_RECURRING_RULE });
	});

	getMentorSlots = asyncHandler((_req, res) => {
		// TODO: Implement get mentor slots
		res.send({});
	});

	cancelSlot = asyncHandler((_req, res) => {
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.CANCELLED_SLOT });
	});
}

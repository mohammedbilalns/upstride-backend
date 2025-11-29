import { HttpStatus, ResponseMessage } from "../../../common/enums";
import asyncHandler from "../utils/asyncHandler";
import { cancelSlotParamsSchema } from "../validations/cancelSlot.validation";
import {
	createCustomAvailabilityParamsSchema,
	createCustomAvailabilityPayloadSchema,
} from "../validations/createCustomAvailability.validation";
import {
	createRecurringRulePayloadSchema,
	createRecurringRuleParamsSchema,
	disableRecurringRuleParmsSchema,
	updateRecurringRuleParmsSchema,
	updateRecurringRulePayloadSchema,
	addRecurringRuleParamsSchema,
	addRecurringRulePayloadSchema,
} from "../validations/recurringRule.validation";
import {
	getMentorRulesParamsSchema,
	getMentorSlotsParamsSchema,
} from "../validations/getMentorSlots.validation";
import { ICreateRecurringRuleUC } from "../../../domain/useCases/recurringRule/createRecurringRule.uc.interface";
import { IUpdateRecurringRuleUC } from "../../../domain/useCases/recurringRule/updateRecurringRule.uc.interface";
import { IAddRecurringRuleUC } from "../../../domain/useCases/recurringRule/addRecurringRule.uc.interface";
import { IDisableRecurringRuleUC } from "../../../domain/useCases/recurringRule/disableRecurringRule.uc.interface";
import { IGetMentorSlotsUC } from "../../../domain/useCases/slots/getMentorSlots.uc.interface";
import { ICancleSlotUC } from "../../../domain/useCases/slots/cancelSlot.uc.interface";
import { ICreateCustomSlotUC } from "../../../domain/useCases/slots/createCustomSlot.uc.interface";
import { IGetRulesUC } from "../../../domain/useCases/recurringRule/getRule.uc.interface";

export class SlotsController {
	constructor(
		private _createCustomSlotUC: ICreateCustomSlotUC,
		private _createRecurringRuleUC: ICreateRecurringRuleUC,
		private _updateRecurringRuleUC: IUpdateRecurringRuleUC,
		private _addRecurringRuleUC: IAddRecurringRuleUC,
		private _disableRecurringRuleUC: IDisableRecurringRuleUC,
		private _getMentorSlotsUC: IGetMentorSlotsUC,
		private _cancelSlotUC: ICancleSlotUC,
		private _getMentorRuleUC: IGetRulesUC,
	) {}

	createCustomSlot = asyncHandler((req, res) => {
		const { mentorId } = createCustomAvailabilityParamsSchema.parse(req.params);
		const payload = createCustomAvailabilityPayloadSchema.parse(req.body);

		this._createCustomSlotUC.execute({ mentorId, ...payload });

		res.status(HttpStatus.CREATED).json({
			success: true,
			message: ResponseMessage.CUSTOM_AVAILABILITY_CREATED,
		});
	});

	createRecurringRule = asyncHandler((req, res) => {
		const { mentorId } = createRecurringRuleParamsSchema.parse(req.params);
		const payload = createRecurringRulePayloadSchema.parse(req.body);

		this._createRecurringRuleUC.execute({ mentorId, ...payload });

		res
			.status(HttpStatus.CREATED)
			.json({ success: true, message: ResponseMessage.RECURRING_RULE_CREATED });
	});

	updateRecurringRule = asyncHandler((req, res) => {
		const { mentorId, ruleId } = updateRecurringRuleParmsSchema.parse(
			req.params,
		);
		const payload = updateRecurringRulePayloadSchema.parse(req.body);

		this._updateRecurringRuleUC.execute({ mentorId, ruleId, rule: payload });

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.RECURRING_RULE_UPDATED });
	});

	addRecurringRule = asyncHandler((req, res) => {
		const { mentorId } = addRecurringRuleParamsSchema.parse(req.params);
		const payload = addRecurringRulePayloadSchema.parse(req.body);
		this._addRecurringRuleUC.execute({ mentorId, rule: payload });

		res
			.status(HttpStatus.CREATED)
			.json({ success: true, message: ResponseMessage.RECURRING_RULE_ADDED });
	});

	disableRecurringRule = asyncHandler((req, res) => {
		const { mentorId, ruleId } = disableRecurringRuleParmsSchema.parse(
			req.params,
		);

		this._disableRecurringRuleUC.execute({ mentorId, ruleId });

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.DISBLED_RECURRING_RULE });
	});

	getMentorSlots = asyncHandler((req, res) => {
		const { mentorId } = getMentorSlotsParamsSchema.parse(req.params);
		const data = this._getMentorSlotsUC.execute({ mentorId });

		res.send(data);
	});

	cancelSlot = asyncHandler((req, res) => {
		const { mentorId, slotId } = cancelSlotParamsSchema.parse(req.params);
		this._cancelSlotUC.execute({ mentorId, slotId });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.CANCELLED_SLOT });
	});

	getMentorRules = asyncHandler((req, res) => {
		const { mentorId } = getMentorRulesParamsSchema.parse(req.params);
		const data = this._getMentorRuleUC.execute({ mentorId });
		res.status(HttpStatus.OK).send(data);
	});
}

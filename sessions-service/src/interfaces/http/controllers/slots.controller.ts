import { HttpStatus, ResponseMessage } from "../../../common/enums";
import asyncHandler from "../utils/async-handler";
import { cancelSlotParamsSchema } from "../validations/cancelSlot.validation";
import { createCustomAvailabilityPayloadSchema } from "../validations/createCustomAvailability.validation";
import {
	updateRecurringRuleParmsSchema,
	updateRecurringRulePayloadSchema,
	addRecurringRulePayloadSchema,
	deleteRecurringRuleParamsSchema,
	toggleRecurringRuleParmsSchema,
} from "../validations/recurringRule.validation";
import { IUpdateRecurringRuleUC } from "../../../domain/useCases/recurringRule/update-recurring-rule.uc.interface";
import { IAddRecurringRuleUC } from "../../../domain/useCases/recurringRule/add-recurring-rule.uc.interface";
import { IDisableRecurringRuleUC } from "../../../domain/useCases/recurringRule/disable-recurring-rule.uc.interface";
import { IGetMentorSlotsUC } from "../../../domain/useCases/slots/get-mentor-slots.uc.interface";
import { ICancleSlotUC } from "../../../domain/useCases/slots/cancel-slot.uc.interface";
import { ICreateCustomSlotUC } from "../../../domain/useCases/slots/create-custom-slot.uc.interface";
import { IGetRulesUC } from "../../../domain/useCases/recurringRule/get-rule.uc.interface";
import { IDeleteRecurringRuleUC } from "../../../domain/useCases/recurringRule/delete-recurring-rule.uc.interface";
import { IEnableRecurringRuleUC } from "../../../domain/useCases/recurringRule/enable-recurring-rule.uc.interface";
import { IDeleteSlotUC } from "../../../domain/useCases/slots/delete-slot.uc.interface";

export class SlotsController {
	constructor(
		private _createCustomSlotUC: ICreateCustomSlotUC,
		private _updateRecurringRuleUC: IUpdateRecurringRuleUC,
		private _addRecurringRuleUC: IAddRecurringRuleUC,
		private _disableRecurringRuleUC: IDisableRecurringRuleUC,
		private _enableRecurringRuleUC: IEnableRecurringRuleUC,
		private _deleteRecurringRuleUC: IDeleteRecurringRuleUC,
		private _getMentorSlotsUC: IGetMentorSlotsUC,
		private _cancelSlotUC: ICancleSlotUC,
		private _deleteSlotUC: IDeleteSlotUC,
		private _getMentorRuleUC: IGetRulesUC,
	) {}

	public createCustomSlot = asyncHandler(async (req, res) => {
		const payload = createCustomAvailabilityPayloadSchema.parse(req.body);
		const { mentorId } = res.locals.user;

		await this._createCustomSlotUC.execute({ mentorId, ...payload });

		res.status(HttpStatus.CREATED).json({
			success: true,
			message: ResponseMessage.CUSTOM_AVAILABILITY_CREATED,
		});
	});

	public updateRecurringRule = asyncHandler(async (req, res) => {
		const { ruleId } = updateRecurringRuleParmsSchema.parse(req.params);
		const { mentorId } = res.locals.user;
		const { invalidateExisting, ...ruleData } =
			updateRecurringRulePayloadSchema.parse(req.body);

		await this._updateRecurringRuleUC.execute({
			mentorId,
			ruleId,
			rule: ruleData,
			invalidateExisting,
		});

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.RECURRING_RULE_UPDATED });
	});

	public addRecurringRule = asyncHandler(async (req, res) => {
		const { mentorId } = res.locals.user;
		const payload = addRecurringRulePayloadSchema.parse(req.body);
		await this._addRecurringRuleUC.execute({ mentorId, rule: payload.rule });

		res
			.status(HttpStatus.CREATED)
			.json({ success: true, message: ResponseMessage.RECURRING_RULE_ADDED });
	});

	public disableRecurringRule = asyncHandler(async (req, res) => {
		const { ruleId } = toggleRecurringRuleParmsSchema.parse(req.params);
		const { mentorId } = res.locals.user;

		await this._disableRecurringRuleUC.execute({ mentorId, ruleId });

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.DISBLED_RECURRING_RULE });
	});

	public enableRecurringRule = asyncHandler(async (req, res) => {
		const { ruleId } = toggleRecurringRuleParmsSchema.parse(req.params);
		const { mentorId } = res.locals.user;

		await this._enableRecurringRuleUC.execute({ mentorId, ruleId });

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.ENABLED_RECURRING_RULE });
	});
	public deleteRecurringRule = asyncHandler(async (req, res) => {
		const { mentorId } = res.locals.user;
		const { ruleId } = deleteRecurringRuleParamsSchema.parse(req.params);
		const deleteSlots = req.query.deleteSlots === "true";

		await this._deleteRecurringRuleUC.execute({
			mentorId,
			ruleId,
			deleteSlots,
		});

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.DELETED_RECURRING_RULE });
	});

	public getMentorSlots = asyncHandler(async (req, res) => {
		const mentorId =
			(req.query.mentorId as string) || res.locals.user?.mentorId;
		const availableOnly = req.query.availableOnly === "true";

		const data = await this._getMentorSlotsUC.execute({
			mentorId,
			availableOnly,
		});

		res.send(data);
	});

	public cancelSlot = asyncHandler(async (req, res) => {
		const { slotId } = cancelSlotParamsSchema.parse(req.params);
		const { mentorId } = res.locals.user;
		await this._cancelSlotUC.execute({ mentorId, slotId });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.CANCELLED_SLOT });
	});

	public deleteSlot = asyncHandler(async (req, res) => {
		const { slotId } = cancelSlotParamsSchema.parse(req.params);
		const { mentorId } = res.locals.user;
		await this._deleteSlotUC.execute({ mentorId, slotId });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.SLOT_DELETED });
	});

	public getMentorRules = asyncHandler(async (_req, res) => {
		const { mentorId } = res.locals.user;
		const data = await this._getMentorRuleUC.execute({ mentorId });
		res.status(HttpStatus.OK).send(data);
	});
}

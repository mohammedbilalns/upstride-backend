import { inject, injectable } from "inversify";
import type {
	AddRecurringRuleInput,
	UpdateRecurringRuleInput,
} from "../../../application/recurring-rule-management/dtos/recurring-rules.dto";
import type {
	IAddRecurringRuleUseCase,
	IDeleteRecurringRuleUseCase,
	IDisableRecurringRuleUseCase,
	IEnableRecurringRuleUseCase,
	IGetRecurringRulesUseCase,
	IUpdateRecurringRuleUseCase,
} from "../../../application/recurring-rule-management/use-cases";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class RecurringRuleController {
	constructor(
		@inject(TYPES.UseCases.AddRecurringRule)
		private readonly _addRecurringRuleUseCase: IAddRecurringRuleUseCase,
		@inject(TYPES.UseCases.DeleteRecurringRule)
		private readonly _deleteRecurringRuleUseCase: IDeleteRecurringRuleUseCase,
		@inject(TYPES.UseCases.DisableRecurringRule)
		private readonly _disableRecurringRuleUseCase: IDisableRecurringRuleUseCase,
		@inject(TYPES.UseCases.EnableRecurringRule)
		private readonly _enableRecurringRuleUseCase: IEnableRecurringRuleUseCase,
		@inject(TYPES.UseCases.GetRecurringRules)
		private readonly _getRecurringRulesUseCase: IGetRecurringRulesUseCase,
		@inject(TYPES.UseCases.UpdateRecurringRule)
		private readonly _updateRecurringRuleUseCase: IUpdateRecurringRuleUseCase,
	) {}

	getRules = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const data = await this._getRecurringRulesUseCase.execute({ userId });
		return sendSuccess(res, HttpStatus.OK, {
			message: "Recurring rules fetched successfully",
			data,
		});
	});

	addRule = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const data = await this._addRecurringRuleUseCase.execute({
			userId,
			...(req.validated?.body as Omit<AddRecurringRuleInput, "userId">),
		});
		return sendSuccess(res, HttpStatus.CREATED, {
			message: "Recurring rule created successfully",
			data,
		});
	});

	updateRule = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const data = await this._updateRecurringRuleUseCase.execute({
			userId,
			ruleId: req.params.ruleId as string,
			...(req.validated?.body as Omit<
				UpdateRecurringRuleInput,
				"userId" | "ruleId"
			>),
		});
		return sendSuccess(res, HttpStatus.OK, {
			message: "Recurring rule updated successfully",
			data,
		});
	});

	deleteRule = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const data = await this._deleteRecurringRuleUseCase.execute({
			userId,
			ruleId: req.params.ruleId as string,
		});
		return sendSuccess(res, HttpStatus.OK, {
			message: "Recurring rule deleted successfully",
			data,
		});
	});

	enableRule = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const data = await this._enableRecurringRuleUseCase.execute({
			userId,
			ruleId: req.params.ruleId as string,
		});
		return sendSuccess(res, HttpStatus.OK, {
			message: "Recurring rule enabled successfully",
			data,
		});
	});

	disableRule = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const data = await this._disableRecurringRuleUseCase.execute({
			userId,
			ruleId: req.params.ruleId as string,
		});
		return sendSuccess(res, HttpStatus.OK, {
			message: "Recurring rule disabled successfully",
			data,
		});
	});
}

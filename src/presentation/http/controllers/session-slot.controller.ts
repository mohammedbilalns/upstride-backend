import { inject, injectable } from "inversify";
import type { GetPublicMentorAvailableSlotsInput } from "../../../application/session-slot-management/dtos/public-mentor-slots.dto";
import type {
	CreateCustomSlotInput,
	GenerateSlotsInput,
	GetMentorSlotsInput,
} from "../../../application/session-slot-management/dtos/session-slots.dto";
import type {
	ICancelSlotUseCase,
	ICreateCustomSlotUseCase,
	IDeleteSlotUseCase,
	IEnableSlotUseCase,
	IGenerateSlotsUseCase,
	IGetMentorSlotsUseCase,
	IGetPublicMentorAvailableSlotsUseCase,
} from "../../../application/session-slot-management/use-cases";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class SessionSlotController {
	constructor(
		@inject(TYPES.UseCases.CancelSlot)
		private readonly _cancelSlotUseCase: ICancelSlotUseCase,
		@inject(TYPES.UseCases.CreateCustomSlot)
		private readonly _createCustomSlotUseCase: ICreateCustomSlotUseCase,
		@inject(TYPES.UseCases.DeleteSlot)
		private readonly _deleteSlotUseCase: IDeleteSlotUseCase,
		@inject(TYPES.UseCases.EnableSlot)
		private readonly _enableSlotUseCase: IEnableSlotUseCase,
		@inject(TYPES.UseCases.GenerateSlots)
		private readonly _generateSlotsUseCase: IGenerateSlotsUseCase,
		@inject(TYPES.UseCases.GetMentorSlots)
		private readonly _getMentorSlotsUseCase: IGetMentorSlotsUseCase,
		@inject(TYPES.UseCases.GetPublicMentorAvailableSlots)
		private readonly _getPublicMentorAvailableSlotsUseCase: IGetPublicMentorAvailableSlotsUseCase,
	) {}

	getSlots = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const query = req.validated?.query as Omit<GetMentorSlotsInput, "userId">;
		const data = await this._getMentorSlotsUseCase.execute({
			userId,
			...query,
		});
		return sendSuccess(res, HttpStatus.OK, {
			message: "Slots fetched successfully",
			data,
		});
	});

	getPublicAvailableSlots = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const query = req.validated?.query as Omit<
			GetPublicMentorAvailableSlotsInput,
			"mentorId" | "requesterUserId"
		>;
		const data = await this._getPublicMentorAvailableSlotsUseCase.execute({
			mentorId: req.params.mentorId as string,
			requesterUserId: userId,
			...query,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: "Available slots fetched successfully",
			data,
		});
	});

	createCustomSlot = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const data = await this._createCustomSlotUseCase.execute({
			userId,
			...(req.validated?.body as Omit<CreateCustomSlotInput, "userId">),
		});
		return sendSuccess(res, HttpStatus.CREATED, {
			message: "Slot created successfully",
			data,
		});
	});

	cancelSlot = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const data = await this._cancelSlotUseCase.execute({
			userId,
			slotId: req.params.slotId as string,
		});
		return sendSuccess(res, HttpStatus.OK, {
			message: "Slot cancelled successfully",
			data,
		});
	});

	enableSlot = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const data = await this._enableSlotUseCase.execute({
			userId,
			slotId: req.params.slotId as string,
		});
		return sendSuccess(res, HttpStatus.OK, {
			message: "Slot enabled successfully",
			data,
		});
	});

	deleteSlot = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const data = await this._deleteSlotUseCase.execute({
			userId,
			slotId: req.params.slotId as string,
		});
		return sendSuccess(res, HttpStatus.OK, {
			message: "Slot deleted successfully",
			data,
		});
	});

	generateSlots = asyncHandler(async (req, res) => {
		const data = await this._generateSlotsUseCase.execute(
			req.validated?.body as GenerateSlotsInput,
		);
		return sendSuccess(res, HttpStatus.OK, {
			message: "Slots generated successfully",
			data,
		});
	});
}

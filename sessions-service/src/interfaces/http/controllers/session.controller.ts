import { HttpStatus, ResponseMessage } from "../../../common/enums";
import { IBookSessionUC } from "../../../domain/useCases/bookings/bookSession.uc.interface";
import { ICancelBookingUC } from "../../../domain/useCases/bookings/cancelBooking.uc.interface";
import { IInitiateSessionUC } from "../../../domain/useCases/sessions/initiateSession.uc.interface";
import { IMarkSessionAsCompleteUC } from "../../../domain/useCases/sessions/markSessionAsComplete.uc.interface";
import asyncHandler from "../utils/asyncHandler";
import {
	bookSessionValidationParamsSchema,
	cancelBookingValidationParamsSchema,
	initiateSessionParamsSchema,
	markSessionAsCompleteParamsSchema,
} from "../validations/booking.validation";

import { IGetSessionsUC } from "../../../domain/useCases/sessions/getSessions.uc.interface";

export class SessionController {
	constructor(
		private _initiateSessionUC: IInitiateSessionUC,
		private _markSessionAsCompleteUC: IMarkSessionAsCompleteUC,
		private _bookSessionUC: IBookSessionUC,
		private _cancelBookingUC: ICancelBookingUC,
		private _getSessionsUC: IGetSessionsUC,
	) {}

	public getSessions = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const type = req.query.type as string; // 'upcoming' | 'history'

		let data;
		if (type === "upcoming") {
			data = await this._getSessionsUC.getUserUpcoming(userId);
		} else {
			data = await this._getSessionsUC.getUserHistory(userId);
		}

		res.status(HttpStatus.OK).json({
			success: true,
			message: ResponseMessage.SUCCESS,
			data,
		});
	});

	public bookSession = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { slotId } = bookSessionValidationParamsSchema.parse(req.params);

		const result = await this._bookSessionUC.execute({ userId, slotId });
		res.status(HttpStatus.OK).json({
			success: true,
			message: ResponseMessage.SESSION_INITIATED,
			data: result,
		});
	});

	public cancelBooking = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { bookingId } = cancelBookingValidationParamsSchema.parse(req.params);

		await this._cancelBookingUC.execute({ userId, bookingId });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.CANCELLED_BOOKING });
	});

	public initiateSession = asyncHandler(async (req, res) => {
		const { sessionId } = initiateSessionParamsSchema.parse(req.params);

		await this._initiateSessionUC.execute({ sessionId });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.SESSION_INITIATED });
	});

	public markSessionAsComplete = asyncHandler(async (req, res) => {
		const { sessionId } = markSessionAsCompleteParamsSchema.parse(req.params);

		await this._markSessionAsCompleteUC.execute({ sessionId });

		res.status(HttpStatus.OK).json({
			success: true,
			message: ResponseMessage.MARKED_SESSION_AS_COMPLETE,
		});
	});
}

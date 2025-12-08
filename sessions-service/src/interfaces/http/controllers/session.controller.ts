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

export class SessionController {
	constructor(
		private _initiateSessionUC: IInitiateSessionUC,
		private _markSessionAsCompleteUC: IMarkSessionAsCompleteUC,
		private _bookSessionUC: IBookSessionUC,
		private _cancelBookingUC: ICancelBookingUC,
	) {}

	public bookSession = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { slotId } = bookSessionValidationParamsSchema.parse(req.params);

		await this._bookSessionUC.execute({ userId, slotId });

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.SESSION_INITIATED });
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

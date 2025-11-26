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
	bookSession = asyncHandler((req, res) => {
		const userId = res.locals.user.id;
		const { slotId } = bookSessionValidationParamsSchema.parse(req.params);

		this._bookSessionUC.execute({ userId, slotId });

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.SESSION_INITIATED });
	});

	cancelBooking = asyncHandler((req, res) => {
		const userId = res.locals.user.id;
		const { slotId } = cancelBookingValidationParamsSchema.parse(req.params);

		this._cancelBookingUC.execute({ userId, slotId });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.CANCELLED_BOOKING });
	});

	initiateSession = asyncHandler((req, res) => {
		const { sessionId } = initiateSessionParamsSchema.parse(req.params);

		this._initiateSessionUC.execute({ sessionId });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.SESSION_INITIATED });
	});

	markSessionAsComplete = asyncHandler((req, res) => {
		const { sessionId } = markSessionAsCompleteParamsSchema.parse(req.params);

		this._markSessionAsCompleteUC.execute({ sessionId });

		res.status(HttpStatus.OK).json({
			success: true,
			message: ResponseMessage.MARKED_SESSION_AS_COMPLETE,
		});
	});
}

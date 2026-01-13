import {
	HttpStatus,
	ResponseMessage,
	ErrorMessage,
} from "../../../common/enums";
import { IBookSessionUC } from "../../../domain/useCases/bookings/book-session.uc.interface";
import { ICancelBookingUC } from "../../../domain/useCases/bookings/cancel-booking.uc.interface";
import { IInitiateSessionUC } from "../../../domain/useCases/sessions/initiate-session.uc.interface";
import { IMarkSessionAsCompleteUC } from "../../../domain/useCases/sessions/mark-session-as-complete.uc.interface";
import { IRequestRescheduleUC } from "../../../domain/useCases/bookings/request-reschedule.usecase.interface";
import { IHandleRescheduleUC } from "../../../domain/useCases/bookings/handle-reschedule.usecase.interface";
import asyncHandler from "../utils/async-handler";
import {
	bookSessionValidationParamsSchema,
	cancelBookingValidationParamsSchema,
	initiateSessionParamsSchema,
	markSessionAsCompleteParamsSchema,
	requestRescheduleParamsSchema,
	requestReschedulePayloadSchema,
	handleRescheduleParamsSchema,
	handleReschedulePayloadSchema,
} from "../validations/booking.validation";

import { IGetSessionsUC } from "../../../domain/useCases/sessions/get-sessions.uc.interface";
import { AppError } from "../../../application/errors/app-error";

export class SessionController {
	constructor(
		private _initiateSessionUC: IInitiateSessionUC,
		private _markSessionAsCompleteUC: IMarkSessionAsCompleteUC,
		private _bookSessionUC: IBookSessionUC,
		private _cancelBookingUC: ICancelBookingUC,
		private _getSessionsUC: IGetSessionsUC,
		private _requestRescheduleUC: IRequestRescheduleUC,
		private _handleRescheduleUC: IHandleRescheduleUC,
	) {}

	public getSessions = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const role = res.locals.user.role;
		const type = req.query.type as string; // 'upcoming' | 'history'

		let data;
		if (role === "mentor") {
			const mentorId = res.locals.user.mentorId;
			if (!mentorId) {
				throw new AppError(
					ErrorMessage.MENTOR_PROFILE_NOT_FOUND,
					HttpStatus.BAD_REQUEST,
				);
			}
			data = await this._getSessionsUC.getMentorSessions(
				mentorId,
				type as "upcoming" | "history",
			);
		} else {
			if (type === "upcoming") {
				data = await this._getSessionsUC.getUserUpcoming(userId);
			} else {
				data = await this._getSessionsUC.getUserHistory(userId);
			}
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

	public requestReschedule = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { bookingId } = requestRescheduleParamsSchema.parse(req.params);
		const payload = requestReschedulePayloadSchema.parse(req.body);

		const result = await this._requestRescheduleUC.execute({
			bookingId,
			userId,
			isStudentRequest: true,
			...payload,
		});

		res.status(HttpStatus.OK).json({
			success: true,
			message: ResponseMessage.RESCHEDULE_REQUESTED,
			data: result,
		});
	});

	public handleReschedule = asyncHandler(async (req, res) => {
		const mentorId = res.locals.user.mentorId;
		if (!mentorId)
			throw new AppError(
				ErrorMessage.MENTOR_ID_MISSING,
				HttpStatus.UNAUTHORIZED,
			);

		const { bookingId } = handleRescheduleParamsSchema.parse(req.params);
		const { action } = handleReschedulePayloadSchema.parse(req.body);

		const result = await this._handleRescheduleUC.execute({
			bookingId,
			action,
			mentorId,
		});

		res.status(HttpStatus.OK).json({
			success: true,
			message:
				action === "APPROVED"
					? ResponseMessage.RESCHEDULE_APPROVED
					: ResponseMessage.RESCHEDULE_REJECTED,
			data: result,
		});
	});
}

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
import { CancelReservationUc } from "../../../application/usecases/bookings/cancel-reservation.uc";
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
import { IGetSessionsListUC } from "../../../domain/useCases/sessions/get-sessions-list.uc.interface";
import { IJoinSessionUC } from "../../../domain/useCases/sessions/join-session.uc.interface";
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
		private _cancelReservationUC: CancelReservationUc,
		private _getSessionsListUC: IGetSessionsListUC,
		private _joinSessionUC: IJoinSessionUC,
	) { }

	/**
	 * Retrieves sessions list with pagination .
	 */
	public getSessionsList = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const mentorId = res.locals.user.mentorId;

		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 15;
		const type = (req.query.type as "upcoming" | "history") || "upcoming";

		const result = await this._getSessionsListUC.execute(
			userId,
			type,
			page,
			limit,
			mentorId
		);

		res.status(HttpStatus.OK).json({
			success: true,
			message: ResponseMessage.SUCCESS,
			data: result,
		});
	});

	/**
	 * Joins a session .
	 */
	public joinSession = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { sessionId } = req.params;

		await this._joinSessionUC.execute(userId, sessionId);

		res.status(HttpStatus.OK).json({
			success: true,
			message: "Session is ready to join",
		});
	});

	/**
	 * Retrieves sessions for a user or mentor (Legacy? Keep for now).
	 */
	public getSessions = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const role = res.locals.user.role;
		const type = req.query.type as string;

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

	/**
	 * Books a session for a specific slot.
	 */
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

	/**
	 * Cancels a booking.
	 */
	public cancelBooking = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { bookingId } = cancelBookingValidationParamsSchema.parse(req.params);

		await this._cancelBookingUC.execute({ userId, bookingId });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.CANCELLED_BOOKING });
	});

	/**
	 * Initiates a session.
	 */
	public initiateSession = asyncHandler(async (req, res) => {
		const { sessionId } = initiateSessionParamsSchema.parse(req.params);

		await this._initiateSessionUC.execute({ sessionId });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.SESSION_INITIATED });
	});

	/**
	 * Marks a session as complete.
	 */
	public markSessionAsComplete = asyncHandler(async (req, res) => {
		const { sessionId } = markSessionAsCompleteParamsSchema.parse(req.params);

		await this._markSessionAsCompleteUC.execute({ sessionId });

		res.status(HttpStatus.OK).json({
			success: true,
			message: ResponseMessage.MARKED_SESSION_AS_COMPLETE,
		});
	});

	/**
	 * Requests a reschedule for a booking.
	 */
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

	/**
	 * Handles a reschedule request (approves or rejects).
	 */
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
	/**
	 * Cancels a reservation for a slot.
	 */
	public cancelReservation = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { slotId } = bookSessionValidationParamsSchema.parse(req.params);

		await this._cancelReservationUC.execute({ userId, slotId });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.CANCELLED_BOOKING });
	});
}

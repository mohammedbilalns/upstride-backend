import { inject, injectable } from "inversify";
import type { ICancelBookingUseCase } from "../../../application/modules/booking-management/use-cases/cancel-booking.usecase.interface";
import type { ICancelBookingByMentorUseCase } from "../../../application/modules/booking-management/use-cases/cancel-booking-by-mentor.usecase.interface";
import type { ICreateBookingUseCase } from "../../../application/modules/booking-management/use-cases/create-booking.usecase.interface";
import type { IGetAvailableSlotsUseCase } from "../../../application/modules/booking-management/use-cases/get-available-slots.usecase.interface";
import type { IGetBookingDetailsUseCase } from "../../../application/modules/booking-management/use-cases/get-booking-details.usecase.interface";
import type { IGetMentorBookingsUseCase } from "../../../application/modules/booking-management/use-cases/get-mentor-bookings.usecase.interface";
import type { IGetUserBookingsUseCase } from "../../../application/modules/booking-management/use-cases/get-user-bookings.usecase.interface";
import type { IRepayBookingUseCase } from "../../../application/modules/booking-management/use-cases/repay-booking.usecase.interface";
import { HttpStatus } from "../../../shared/constants/http-status-codes";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { RESPONSE_MESSAGES } from "../constants/response-messages";
import { asyncHandler, sendSuccess } from "../helpers";
import type {
	bookingDetailsParams,
	bookingListQuery,
	cancelBookingParams,
	cancellBookingBody,
	createBookingBody,
	getAvaialableSlotsParams,
	getAvailableSlotsQuery,
	repayBookingParams,
} from "../validators";

@injectable()
export class BookingController {
	constructor(
		@inject(TYPES.UseCases.GetAvailableSlots)
		private readonly _getAvailableSlotsUseCase: IGetAvailableSlotsUseCase,
		@inject(TYPES.UseCases.CreateBooking)
		private readonly _createBookingUseCase: ICreateBookingUseCase,
		@inject(TYPES.UseCases.CancelBooking)
		private readonly _cancelBookingUseCase: ICancelBookingUseCase,
		@inject(TYPES.UseCases.CancelBookingByMentor)
		private readonly _cancelBookingByMentorUseCase: ICancelBookingByMentorUseCase,
		@inject(TYPES.UseCases.GetUserBookings)
		private readonly _getUserBookingsUseCase: IGetUserBookingsUseCase,
		@inject(TYPES.UseCases.GetMentorBookings)
		private readonly _getMentorBookingsUseCase: IGetMentorBookingsUseCase,
		@inject(TYPES.UseCases.GetBookingDetails)
		private readonly _getBookingDetailsUseCase: IGetBookingDetailsUseCase,
		@inject(TYPES.UseCases.RepayBooking)
		private readonly _repayBookingUseCase: IRepayBookingUseCase,
	) {}

	getAvailableSlots = asyncHandler(async (req, res) => {
		const requesterUserId = (req as AuthenticatedRequest).user.id;

		const result = await this._getAvailableSlotsUseCase.execute({
			...(req.validated?.params as getAvaialableSlotsParams),
			...(req.validated?.query as getAvailableSlotsQuery),
			requesterUserId,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.BOOKING.SLOTS_COMPUTED,
			data: { slots: result.slots },
		});
	});

	createBooking = asyncHandler(async (req, res) => {
		const menteeId = (req as AuthenticatedRequest).user.id;

		const result = await this._createBookingUseCase.execute({
			menteeId,
			...(req.validated?.body as createBookingBody),
		});

		return sendSuccess(res, HttpStatus.CREATED, {
			message:
				result.paymentStatus === "COMPLETED"
					? RESPONSE_MESSAGES.BOOKING.CONFIRMED
					: "Booking initiated. Please complete the payment.",
			data: result,
		});
	});

	cancelBooking = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;

		const result = await this._cancelBookingUseCase.execute({
			userId,
			bookingId: (req.validated?.params as cancelBookingParams).id,
			...(req.validated?.body as cancellBookingBody),
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.BOOKING.CANCELLED,
			data: result,
		});
	});

	cancelBookingByMentor = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;

		const result = await this._cancelBookingByMentorUseCase.execute({
			userId,
			bookingId: (req.validated?.params as cancelBookingParams).id,
			...(req.validated?.body as cancellBookingBody),
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.BOOKING.CANCELLED_BY_MENTOR,
			data: result,
		});
	});

	repayBooking = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;

		const result = await this._repayBookingUseCase.execute({
			userId,
			bookingId: (req.validated?.params as repayBookingParams).id,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.BOOKING.PAYMENT_INITIATED,
			data: result,
		});
	});

	getUserBookings = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;

		const result = await this._getUserBookingsUseCase.execute({
			userId,
			...(req.validated?.query as bookingListQuery),
		});

		return sendSuccess(res, HttpStatus.OK, {
			data: result,
		});
	});

	getMentorBookings = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const result = await this._getMentorBookingsUseCase.execute({
			userId,
			...(req.validated?.query as bookingListQuery),
		});

		return sendSuccess(res, HttpStatus.OK, {
			data: result,
		});
	});

	getBookingDetails = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const result = await this._getBookingDetailsUseCase.execute({
			userId,
			bookingId: (req.validated?.params as bookingDetailsParams).id,
		});

		return sendSuccess(res, HttpStatus.OK, {
			data: result,
		});
	});
}

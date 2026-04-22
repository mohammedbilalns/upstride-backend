import { inject, injectable } from "inversify";
import type { ICancelBookingUseCase } from "../../../application/modules/booking/use-cases/cancel-booking.use-case.interface";
import type { ICancelBookingByMentorUseCase } from "../../../application/modules/booking/use-cases/cancel-booking-by-mentor.use-case.interface";
import type { ICreateBookingUseCase } from "../../../application/modules/booking/use-cases/create-booking.use-case.interface";
import type { IGenerateReceiptPdfUseCase } from "../../../application/modules/booking/use-cases/generate-receipt-pdf.use-case.interface";
import type { IGetAvailableSlotsUseCase } from "../../../application/modules/booking/use-cases/get-available-slots.use-case.interface";
import type { IGetBookingDetailsUseCase } from "../../../application/modules/booking/use-cases/get-booking-details.use-case.interface";
import type { IGetMentorBookingsUseCase } from "../../../application/modules/booking/use-cases/get-mentor-bookings.use-case.interface";
import type { IGetUserBookingsUseCase } from "../../../application/modules/booking/use-cases/get-user-bookings.use-case.interface";
import type { IRepayBookingUseCase } from "../../../application/modules/booking/use-cases/repay-booking.use-case.interface";
import { HttpStatus } from "../../../shared/constants/http-status-codes";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { RESPONSE_MESSAGES } from "../constants/response-messages";
import { asyncHandler, sendSuccess } from "../helpers";
import type {
	BookingDetailsParams,
	BookingListQuery,
	CancelBookingParams,
	CancellBookingBody,
	CreateBookingBody,
	GetAvaialableSlotsParams,
	GetAvailableSlotsQuery,
	RepayBookingParams,
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
		@inject(TYPES.UseCases.GenerateReceiptPdf)
		private readonly _generateReceiptPdfUseCase: IGenerateReceiptPdfUseCase,
	) {}

	getAvailableSlots = asyncHandler(async (req: AuthenticatedRequest, res) => {
		const result = await this._getAvailableSlotsUseCase.execute({
			...(req.validated?.params as GetAvaialableSlotsParams),
			...(req.validated?.query as GetAvailableSlotsQuery),
			requesterUserId: req.user.id,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.BOOKING.SLOTS_COMPUTED,
			data: { slots: result.slots },
		});
	});

	createBooking = asyncHandler(async (req: AuthenticatedRequest, res) => {
		const result = await this._createBookingUseCase.execute({
			menteeId: req.user.id,
			...(req.validated?.body as CreateBookingBody),
		});

		return sendSuccess(res, HttpStatus.CREATED, {
			message:
				result.paymentStatus === "COMPLETED"
					? RESPONSE_MESSAGES.BOOKING.CONFIRMED
					: "Booking initiated. Please complete the payment.",
			data: result,
		});
	});

	cancelBooking = asyncHandler(async (req: AuthenticatedRequest, res) => {
		const result = await this._cancelBookingUseCase.execute({
			userId: req.user.id,
			bookingId: (req.validated?.params as CancelBookingParams).id,
			...(req.validated?.body as CancellBookingBody),
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.BOOKING.CANCELLED,
			data: result,
		});
	});

	cancelBookingByMentor = asyncHandler(
		async (req: AuthenticatedRequest, res) => {
			const result = await this._cancelBookingByMentorUseCase.execute({
				userId: req.user.id,
				bookingId: (req.validated?.params as CancelBookingParams).id,
				...(req.validated?.body as CancellBookingBody),
			});

			return sendSuccess(res, HttpStatus.OK, {
				message: RESPONSE_MESSAGES.BOOKING.CANCELLED_BY_MENTOR,
				data: result,
			});
		},
	);

	repayBooking = asyncHandler(async (req: AuthenticatedRequest, res) => {
		const result = await this._repayBookingUseCase.execute({
			userId: req.user.id,
			bookingId: (req.validated?.params as RepayBookingParams).id,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.BOOKING.PAYMENT_INITIATED,
			data: result,
		});
	});

	getUserBookings = asyncHandler(async (req: AuthenticatedRequest, res) => {
		const result = await this._getUserBookingsUseCase.execute({
			userId: req.user.id,
			...(req.validated?.query as BookingListQuery),
		});

		return sendSuccess(res, HttpStatus.OK, {
			data: result,
		});
	});

	getMentorBookings = asyncHandler(async (req: AuthenticatedRequest, res) => {
		const result = await this._getMentorBookingsUseCase.execute({
			userId: req.user.id,
			...(req.validated?.query as BookingListQuery),
		});

		return sendSuccess(res, HttpStatus.OK, {
			data: result,
		});
	});

	getBookingDetails = asyncHandler(async (req: AuthenticatedRequest, res) => {
		const result = await this._getBookingDetailsUseCase.execute({
			userId: req.user.id,
			bookingId: (req.validated?.params as BookingDetailsParams).id,
		});

		return sendSuccess(res, HttpStatus.OK, {
			data: result,
		});
	});

	generateReceiptPdf = asyncHandler(async (req: AuthenticatedRequest, res) => {
		const bookingId = (req.params as { id: string }).id;
		const result = await this._generateReceiptPdfUseCase.execute({
			userId: req.user.id,
			bookingId,
		});

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader(
			"Content-Disposition",
			`attachment; filename="${result.filename}"`,
		);
		res.setHeader("Content-Length", result.pdfBuffer.length.toString());
		res.send(result.pdfBuffer);
	});
}

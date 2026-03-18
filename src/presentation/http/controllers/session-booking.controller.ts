import { inject, injectable } from "inversify";
import type { GetBookingsInput } from "../../../application/session-booking-management/dtos/get-bookings.dto";
import type {
	BookSessionInput,
	HandleRescheduleInput,
} from "../../../application/session-booking-management/dtos/session-booking.dto";
import type {
	IBookSessionUseCase,
	ICancelBookingUseCase,
	IGetMentorBookingsUseCase,
	IGetUserBookingsUseCase,
	IHandleRescheduleUseCase,
	IRequestRescheduleUseCase,
} from "../../../application/session-booking-management/use-cases";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class SessionBookingController {
	constructor(
		@inject(TYPES.UseCases.BookSession)
		private readonly _bookSessionUseCase: IBookSessionUseCase,
		@inject(TYPES.UseCases.CancelBooking)
		private readonly _cancelBookingUseCase: ICancelBookingUseCase,
		@inject(TYPES.UseCases.RequestReschedule)
		private readonly _requestRescheduleUseCase: IRequestRescheduleUseCase,
		@inject(TYPES.UseCases.HandleReschedule)
		private readonly _handleRescheduleUseCase: IHandleRescheduleUseCase,
		@inject(TYPES.UseCases.GetUserBookings)
		private readonly _getUserBookingsUseCase: IGetUserBookingsUseCase,
		@inject(TYPES.UseCases.GetMentorBookings)
		private readonly _getMentorBookingsUseCase: IGetMentorBookingsUseCase,
	) {}

	bookSession = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const data = await this._bookSessionUseCase.execute({
			userId,
			...(req.validated?.body as Omit<BookSessionInput, "userId">),
		});
		return sendSuccess(res, HttpStatus.CREATED, {
			message: "Session booked successfully",
			data,
		});
	});

	cancelBooking = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const data = await this._cancelBookingUseCase.execute({
			userId,
			bookingId: req.params.bookingId as string,
		});
		return sendSuccess(res, HttpStatus.OK, {
			message: "Booking cancelled successfully",
			data,
		});
	});

	requestReschedule = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const data = await this._requestRescheduleUseCase.execute({
			userId,
			bookingId: req.params.bookingId as string,
		});
		return sendSuccess(res, HttpStatus.OK, {
			message: "Reschedule requested successfully",
			data,
		});
	});

	handleReschedule = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const data = await this._handleRescheduleUseCase.execute({
			userId,
			bookingId: req.params.bookingId as string,
			...(req.validated?.body as Omit<
				HandleRescheduleInput,
				"userId" | "bookingId"
			>),
		});
		return sendSuccess(res, HttpStatus.OK, {
			message: "Reschedule handled successfully",
			data,
		});
	});

	getUserBookings = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const query = req.validated?.query as Omit<GetBookingsInput, "userId">;
		const data = await this._getUserBookingsUseCase.execute({
			userId,
			...query,
		});
		return sendSuccess(res, HttpStatus.OK, {
			message: "Bookings fetched successfully",
			data,
		});
	});

	getMentorBookings = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const query = req.validated?.query as Omit<GetBookingsInput, "userId">;
		const data = await this._getMentorBookingsUseCase.execute({
			userId,
			...query,
		});
		return sendSuccess(res, HttpStatus.OK, {
			message: "Bookings fetched successfully",
			data,
		});
	});
}

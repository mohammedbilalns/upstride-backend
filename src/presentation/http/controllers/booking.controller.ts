import { inject, injectable } from "inversify";
import type { z } from "zod";
import type { ICancelBookingUseCase } from "../../../application/modules/booking-management/use-cases/cancel-booking.usecase.interface";
import type { ICancelBookingByMentorUseCase } from "../../../application/modules/booking-management/use-cases/cancel-booking-by-mentor.usecase.interface";
import type { ICreateBookingUseCase } from "../../../application/modules/booking-management/use-cases/create-booking.usecase.interface";
import type { IGetAvailableSlotsUseCase } from "../../../application/modules/booking-management/use-cases/get-available-slots.usecase.interface";
import type { IGetMentorBookingsUseCase } from "../../../application/modules/booking-management/use-cases/get-mentor-bookings.usecase.interface";
import type { IGetUserBookingsUseCase } from "../../../application/modules/booking-management/use-cases/get-user-bookings.usecase.interface";
import { getMentorByUserIdOrThrow } from "../../../application/shared/utilities/mentor.util";
import type { IMentorWriteRepository } from "../../../domain/repositories/mentor-write.repository.interface";
import { HttpStatus } from "../../../shared/constants/http-status-codes";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { RESPONSE_MESSAGES } from "../constants/response-messages";
import { asyncHandler, sendSuccess } from "../helpers";
import type {
	bookingListSchema,
	cancelBookingSchema,
	createBookingSchema,
	getAvailableSlotsSchema,
} from "../validators/booking.validator";

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
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorWriteRepository: IMentorWriteRepository,
	) {}

	getAvailableSlots = asyncHandler(async (req, res) => {
		const { params, query } = req.validated as {
			params: z.infer<typeof getAvailableSlotsSchema.params>;
			query: z.infer<typeof getAvailableSlotsSchema.query>;
		};
		const requesterUserId = (req as AuthenticatedRequest).user.id;

		const result = await this._getAvailableSlotsUseCase.execute({
			mentorId: params.mentorId,
			date: query.date,
			requesterUserId,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.BOOKING.SLOTS_COMPUTED,
			data: result.slots,
		});
	});

	createBooking = asyncHandler(async (req, res) => {
		const menteeId = (req as AuthenticatedRequest).user.id;
		const { body } = req.validated as {
			body: z.infer<typeof createBookingSchema.body>;
		};

		const result = await this._createBookingUseCase.execute({
			menteeId,
			mentorId: body.mentorId,
			startTime: body.startTime.toISOString(),
			endTime: body.endTime.toISOString(),
			paymentType: body.paymentType,
			notes: body.notes,
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
		const { params, body } = req.validated as {
			params: z.infer<typeof cancelBookingSchema.params>;
			body: z.infer<typeof cancelBookingSchema.body>;
		};

		const result = await this._cancelBookingUseCase.execute({
			userId,
			bookingId: params.id,
			reason: body.reason,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.BOOKING.CANCELLED,
			data: result,
		});
	});

	cancelBookingByMentor = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorWriteRepository,
			userId,
		);
		const { params, body } = req.validated as {
			params: z.infer<typeof cancelBookingSchema.params>;
			body: z.infer<typeof cancelBookingSchema.body>;
		};

		const result = await this._cancelBookingByMentorUseCase.execute({
			userId: mentor.id,
			bookingId: params.id,
			reason: body.reason,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.BOOKING.CANCELLED_BY_MENTOR,
			data: result,
		});
	});

	getUserBookings = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const { query } = req.validated as {
			query: z.infer<typeof bookingListSchema.query>;
		};

		const result = await this._getUserBookingsUseCase.execute({
			userId,
			filter: query.filter,
			page: query.page,
			limit: query.limit,
		});

		return sendSuccess(res, HttpStatus.OK, {
			data: result,
		});
	});

	getMentorBookings = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorWriteRepository,
			userId,
		);
		const { query } = req.validated as {
			query: z.infer<typeof bookingListSchema.query>;
		};

		const result = await this._getMentorBookingsUseCase.execute({
			userId: mentor.id,
			filter: query.filter,
			page: query.page,
			limit: query.limit,
		});

		return sendSuccess(res, HttpStatus.OK, {
			data: result,
		});
	});
}

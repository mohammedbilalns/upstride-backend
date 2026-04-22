import { inject, injectable } from "inversify";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getClientBaseUrl } from "../../../../shared/utilities/url.util";
import type { IPaymentService } from "../../../services/payment.service.interface";
import { ValidationError } from "../../../shared/errors";
import { NotFoundError } from "../../../shared/errors/not-found-error";
import { UnauthorizedError } from "../../authentication/errors";
import type {
	RepayBookingInput,
	RepayBookingResponse,
} from "../dtos/booking.dto";
import type { IRepayBookingUseCase } from "./repay-booking.use-case.interface";

@injectable()
export class RepayBookingUseCase implements IRepayBookingUseCase {
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
		@inject(TYPES.Services.PaymentService)
		private readonly _paymentService: IPaymentService,
	) {}

	async execute(input: RepayBookingInput): Promise<RepayBookingResponse> {
		const booking = await this._bookingRepository.findById(input.bookingId);
		if (!booking) {
			throw new NotFoundError("Booking not found");
		}

		if (booking.menteeId !== input.userId) {
			throw new UnauthorizedError("Unauthorized to repay this booking");
		}

		if (booking.paymentType !== "STRIPE") {
			throw new ValidationError("Only Stripe payments can be repaid");
		}

		if (booking.paymentStatus === "COMPLETED") {
			return {
				bookingId: booking.id,
				paymentStatus: booking.paymentStatus,
				paymentUrl: null,
			};
		}

		if (booking.status.startsWith("CANCELLED")) {
			throw new ValidationError("Cannot repay a cancelled booking");
		}

		const frontendBaseUrl = getClientBaseUrl();
		const session = await this._paymentService.createCheckoutSession({
			userId: booking.menteeId,
			coins: 0,
			amount: Math.round(booking.totalAmount * 100),
			currency: booking.currency,
			successUrl: `${frontendBaseUrl}/sessions?booking_success=true&booking_id=${booking.id}`,
			cancelUrl: `${frontendBaseUrl}/sessions`,
			metadata: {
				bookingId: booking.id,
				type: "BOOKING_PAYMENT",
			},
		});

		return {
			bookingId: booking.id,
			paymentStatus: booking.paymentStatus,
			paymentUrl: session.url ?? undefined,
		};
	}
}

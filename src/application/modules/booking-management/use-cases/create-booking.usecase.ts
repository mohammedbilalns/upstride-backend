import { inject, injectable } from "inversify";
import {
	Booking,
	type PaymentStatus,
} from "../../../../domain/entities/booking.entity";
import type { CoinTransactionType } from "../../../../domain/entities/coin-transactions.entity";
import {
	PaymentProvider,
	PaymentTransaction,
	PaymentStatus as PaymentTransactionStatus,
} from "../../../../domain/entities/payment-transactions.entity";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import type { IMentorProfileReadRepository } from "../../../../domain/repositories/mentor-profile-read.repository.interface";
import type { IPaymentTransactionRepository } from "../../../../domain/repositories/payment-transactions.repository.interface";
import type { IPlatformWalletRepository } from "../../../../domain/repositories/platform-wallet.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { getClientBaseUrl } from "../../../../shared/utilities/url.util";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import type { IPaymentService } from "../../../services/payment.service.interface";
import type { IWalletService } from "../../../services/wallet.service.interface";
import { NotFoundError } from "../../../shared/errors/not-found-error";
import type {
	CreateBookingInput,
	CreateBookingResponse,
} from "../dtos/booking.dto";
import { SlotNotAvailableError } from "../errors/booking.errors";
import { calculateBookingAmount } from "../utils/calculate-booking-amount.util";
import { generateMeetingLink } from "../utils/generate-meeting-link.util";
import type { ICreateBookingUseCase } from "./create-booking.usecase.interface";
import type { IScheduleLiveSesionReminderUseCase } from "./schedule-mentor-reminder.usecase.interface";

@injectable()
export class CreateBookingUseCase implements ICreateBookingUseCase {
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
		@inject(TYPES.Repositories.MentorProfileReadRepository)
		private readonly _mentorRepository: IMentorProfileReadRepository,
		@inject(TYPES.Repositories.PaymentTransactionRepository)
		private readonly _paymentTransactionRepository: IPaymentTransactionRepository,
		@inject(TYPES.Repositories.PlatformWalletRepository)
		private readonly _platformWalletRepository: IPlatformWalletRepository,
		@inject(TYPES.Services.WalletService)
		private readonly _walletService: IWalletService,
		@inject(TYPES.Services.PaymentService)
		private readonly _paymentService: IPaymentService,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
		@inject(TYPES.UseCases.ScheduleLiveSesionReminder)
		private readonly _scheduleLiveSesionReminderUseCase: IScheduleLiveSesionReminderUseCase,
	) {}

	async execute(input: CreateBookingInput): Promise<CreateBookingResponse> {
		Booking.assertCanBook(input.menteeId, input.mentorId);

		const bookingId = this._idGenerator.generate();

		const mentor = await this._mentorRepository.findProfileById(input.mentorId);
		if (!mentor) {
			throw new NotFoundError("Mentor not found");
		}

		const start = new Date(input.startTime);
		const end = new Date(input.endTime);
		const { totalAmountCurrency, totalAmountCoins } = calculateBookingAmount(
			mentor.currentPricePer30Min ?? 0,
			start,
			end,
		);

		const validationData = Booking.create({
			menteeId: input.menteeId,
			mentorId: input.mentorId,
			startTime: input.startTime,
			endTime: input.endTime,
			meetingLink: "Pending",
			paymentType: input.paymentType,
			paymentStatus: "PENDING",
			totalAmount:
				input.paymentType === "STRIPE" ? totalAmountCurrency : totalAmountCoins,
			currency: input.paymentType === "STRIPE" ? "inr" : "COINS",
			notes: input.notes,
		});

		const overlap = await this._bookingRepository.findOverlapping(
			input.mentorId,
			start,
			end,
		);

		if (overlap.length > 0) {
			throw new SlotNotAvailableError();
		}

		let paymentStatus: PaymentStatus = "PENDING";
		let paymentUrl: string | undefined;

		if (input.paymentType === "COINS") {
			// Debit coins
			await this._walletService.debit(
				input.menteeId,
				totalAmountCoins,
				"session_spend" as CoinTransactionType,
				"Booking",
				bookingId,
			);
			const platformAmountMinor = Math.round(totalAmountCurrency * 100);
			if (platformAmountMinor > 0) {
				await this._platformWalletRepository.incrementBalance(
					platformAmountMinor,
				);
				await this._paymentTransactionRepository.create(
					new PaymentTransaction(
						this._idGenerator.generate(),
						input.menteeId,
						PaymentProvider.Internal,
						`coin_booking_${bookingId}`,
						platformAmountMinor,
						"inr",
						PaymentTransactionStatus.Completed,
						0,
						"session",
						"COINS",
						undefined,
						"platform",
					),
				);
			}
			paymentStatus = "COMPLETED";
		}

		const booking = new Booking(
			bookingId,
			validationData.mentorId,
			mentor.userId,
			validationData.menteeId,
			validationData.startTime,
			validationData.endTime,
			paymentStatus === "COMPLETED" ? "CONFIRMED" : "PENDING",
			generateMeetingLink(bookingId, paymentStatus),
			validationData.paymentType,
			paymentStatus,
			validationData.totalAmount,
			validationData.currency,
			validationData.notes || null,
			null,
			null,
			new Date(),
			new Date(),
		);

		const createdBooking = await this._bookingRepository.create(booking);

		if (paymentStatus === "COMPLETED") {
			await this._scheduleLiveSesionReminderUseCase.execute({
				start,
				bookingId: createdBooking.id,
				mentorId: mentor.userId,
				menteeId: input.menteeId,
			});
		}

		if (input.paymentType === "STRIPE") {
			const frontendBaseUrl = getClientBaseUrl();
			const session = await this._paymentService.createCheckoutSession({
				userId: input.menteeId,
				coins: 0,
				amount: Math.round(totalAmountCurrency * 100),
				currency: "inr",
				successUrl: `${frontendBaseUrl}/sessions?booking_success=true&booking_id=${createdBooking.id}`,
				cancelUrl: `${frontendBaseUrl}/sessions`,
				metadata: {
					bookingId: createdBooking.id,
					type: "BOOKING_PAYMENT",
				},
			});
			paymentUrl = session.url ?? undefined;
		}

		return {
			bookingId: createdBooking.id,
			paymentStatus,
			paymentUrl,
		};
	}
}

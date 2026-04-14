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
import { COIN_VALUE } from "../../../../shared/constants";
import { TYPES } from "../../../../shared/types/types";
import { getClientBaseUrl } from "../../../../shared/utilities/url.util";
import type { JobQueuePort } from "../../../ports/job-queue.port";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import type { IPaymentService } from "../../../services/payment.service.interface";
import type { IWalletService } from "../../../services/wallet.service.interface";
import { NotFoundError } from "../../../shared/errors/not-found-error";
import type {
	CreateBookingInput,
	CreateBookingResponse,
} from "../dtos/booking.dto";
import { SlotNotAvailableError } from "../errors/booking.errors";
import type { ICreateBookingUseCase } from "./create-booking.usecase.interface";

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
		@inject(TYPES.Services.JobQueue)
		private readonly _jobQueue: JobQueuePort,
	) {}

	async execute(input: CreateBookingInput): Promise<CreateBookingResponse> {
		Booking.assertCanBook(input.menteeId, input.mentorId);

		const bookingId = this._idGenerator.generate();

		const mentor = await this._mentorRepository.findProfileById(input.mentorId);
		if (!mentor) {
			throw new NotFoundError("Mentor not found");
		}

		const pricePer30Min = mentor.currentPricePer30Min ?? 0;
		const start = new Date(input.startTime);
		const end = new Date(input.endTime);
		const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
		const totalAmountCoins = (durationMinutes / 30) * pricePer30Min;
		if (!Number.isFinite(COIN_VALUE) || COIN_VALUE <= 0) {
			throw new NotFoundError("Invalid coin value configuration");
		}
		const totalAmountCurrency = totalAmountCoins / COIN_VALUE;

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
			// Debit coins first
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

		const meetingLink =
			paymentStatus === "COMPLETED"
				? `${getClientBaseUrl()}/call/${bookingId}`
				: validationData.meetingLink;

		const booking = new Booking(
			bookingId,
			validationData.mentorId,
			mentor.userId,
			validationData.menteeId,
			validationData.startTime,
			validationData.endTime,
			paymentStatus === "COMPLETED" ? "CONFIRMED" : "PENDING",
			meetingLink,
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
			const oneHourBefore = start.getTime() - 60 * 60 * 1000;
			const fiveMinutesBefore = start.getTime() - 5 * 60 * 1000;
			const now = Date.now();

			if (oneHourBefore > now) {
				await this._jobQueue.enqueue(
					"send-session-reminder",
					{
						bookingId: createdBooking.id,
						mentorId: input.mentorId,
						menteeId: input.menteeId,
						label: "1 hour",
					},
					{ delay: oneHourBefore - now },
				);
			}

			if (fiveMinutesBefore > now) {
				await this._jobQueue.enqueue(
					"send-session-reminder",
					{
						bookingId: createdBooking.id,
						mentorId: input.mentorId,
						menteeId: input.menteeId,
						label: "5 minutes",
					},
					{ delay: fiveMinutesBefore - now },
				);
			}
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

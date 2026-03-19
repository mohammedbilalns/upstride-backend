import { inject, injectable } from "inversify";
import {
	CoinTransaction,
	CoinTransactionType,
} from "../../../domain/entities/coin-transactions.entity";
import type { ICoinTransactionRepository } from "../../../domain/repositories/coin-transactions.repository.interface";
import type { IMentorRepository } from "../../../domain/repositories/mentor.repository.interface";
import type { IPlatformWalletRepository } from "../../../domain/repositories/platform-wallet.repository.interface";
import type { ISessionBookingRepository } from "../../../domain/repositories/session-booking.repository.interface";
import type { ISessionSlotRepository } from "../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type { IIdGenerator } from "../../services/id-generator.service.interface";
import type { IWalletService } from "../../services/wallet.service.interface";
import { SlotNotFoundError } from "../../session-slot-management/errors";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { ValidationError } from "../../shared/errors/validation-error";
import type {
	CancelBookingInput,
	CancelBookingResponse,
} from "../dtos/session-booking.dto";
import type { ICancelBookingByMentorUseCase } from "./cancel-booking-by-mentor.usecase.interface";

@injectable()
export class CancelBookingByMentorUseCase
	implements ICancelBookingByMentorUseCase
{
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
		@inject(TYPES.Repositories.SessionBookingRepository)
		private readonly _bookingRepository: ISessionBookingRepository,
		@inject(TYPES.Repositories.SessionSlotRepository)
		private readonly _slotRepository: ISessionSlotRepository,
		@inject(TYPES.Repositories.CoinTransactionRepository)
		private readonly _coinTransactionRepository: ICoinTransactionRepository,
		@inject(TYPES.Repositories.PlatformWalletRepository)
		private readonly _platformWalletRepository: IPlatformWalletRepository,
		@inject(TYPES.Services.WalletService)
		private readonly _walletService: IWalletService,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
	) {}

	async execute({
		userId,
		bookingId,
		reason,
	}: CancelBookingInput): Promise<CancelBookingResponse> {
		const mentor = await this._mentorRepository.findByUserId(userId);
		if (!mentor) {
			throw new NotFoundError("Mentor profile not found");
		}

		const booking = await this._bookingRepository.findById(bookingId);
		if (!booking || booking.mentorId !== mentor.id) {
			throw new NotFoundError("Booking not found");
		}

		if (
			booking.status === "cancelled" ||
			booking.status === "refunded" ||
			booking.status === "completed"
		) {
			throw new ValidationError("Booking cannot be cancelled");
		}

		await this._bookingRepository.updateById(bookingId, {
			status: "cancelled",
			cancellationReason: reason,
			cancelledBy: "mentor",
			updatedAt: new Date(),
		});

		const slotUpdated = await this._slotRepository.updateById(booking.slotId, {
			status: "available",
			bookingId: null,
		});
		if (!slotUpdated) {
			throw new SlotNotFoundError();
		}

		const refundAmount = booking.price;

		await this._walletService.credit(
			booking.userId,
			refundAmount,
			CoinTransactionType.Refund,
			"session_booking",
			booking.id,
		);

		await this._coinTransactionRepository.create(
			new CoinTransaction(
				this._idGenerator.generate(),
				booking.userId,
				-refundAmount,
				CoinTransactionType.Refund,
				"session_booking",
				booking.id,
				undefined,
				"platform",
			),
		);

		await this._platformWalletRepository.incrementBalance(-refundAmount);

		return { bookingId, status: "cancelled" };
	}
}

import { inject, injectable } from "inversify";
import {
	CoinTransaction,
	CoinTransactionType,
} from "../../../domain/entities/coin-transactions.entity";
import type { ICoinTransactionRepository } from "../../../domain/repositories/coin-transactions.repository.interface";
import type { IPlatformWalletRepository } from "../../../domain/repositories/platform-wallet.repository.interface";
import type { ISessionBookingRepository } from "../../../domain/repositories/session-booking.repository.interface";
import type { ISessionSlotRepository } from "../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type { IIdGenerator } from "../../services/id-generator.service.interface";
import type { PlatformSettingsService } from "../../services/platform-settings.service";
import type { IWalletService } from "../../services/wallet.service.interface";
import { SlotNotFoundError } from "../../session-slot-management/errors";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { ValidationError } from "../../shared/errors/validation-error";
import type {
	CancelBookingInput,
	CancelBookingResponse,
} from "../dtos/session-booking.dto";
import type { ICancelBookingUseCase } from "./cancel-booking.usecase.interface";

@injectable()
export class CancelBookingUseCase implements ICancelBookingUseCase {
	constructor(
		@inject(TYPES.Repositories.SessionBookingRepository)
		private readonly _bookingRepository: ISessionBookingRepository,
		@inject(TYPES.Repositories.SessionSlotRepository)
		private readonly _slotRepository: ISessionSlotRepository,
		@inject(TYPES.Repositories.CoinTransactionRepository)
		private readonly _coinTransactionRepository: ICoinTransactionRepository,
		@inject(TYPES.Repositories.PlatformWalletRepository)
		private readonly _platformWalletRepository: IPlatformWalletRepository,
		@inject(TYPES.Services.PlatformSettings)
		private readonly _platformSettingsService: PlatformSettingsService,
		@inject(TYPES.Services.WalletService)
		private readonly _walletService: IWalletService,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
	) {}

	async execute({
		userId,
		bookingId,
	}: CancelBookingInput): Promise<CancelBookingResponse> {
		const booking = await this._bookingRepository.findById(bookingId);
		if (!booking || booking.userId !== userId) {
			throw new NotFoundError("Booking not found");
		}

		if (booking.status === "cancelled" || booking.status === "refunded") {
			throw new ValidationError("Booking is already cancelled");
		}

		const hours =
			this._platformSettingsService.sessions.cancellationWindowHours;
		const latest = new Date(booking.startTime);
		latest.setHours(latest.getHours() - hours);
		if (new Date() > latest) {
			throw new ValidationError("Cancellation window has passed");
		}

		await this._bookingRepository.updateById(bookingId, {
			status: "cancelled",
			updatedAt: new Date(),
		});

		const slotUpdated = await this._slotRepository.updateById(booking.slotId, {
			status: "available",
			bookingId: null,
		});
		if (!slotUpdated) {
			throw new SlotNotFoundError();
		}

		await this._walletService.credit(
			userId,
			booking.price,
			CoinTransactionType.Refund,
			"session_booking",
			booking.id,
		);

		await this._coinTransactionRepository.create(
			new CoinTransaction(
				this._idGenerator.generate(),
				userId,
				-booking.price,
				CoinTransactionType.Refund,
				"session_booking",
				booking.id,
				undefined,
				"platform",
			),
		);

		await this._platformWalletRepository.incrementBalance(-booking.price);

		return { bookingId, status: "cancelled" };
	}
}

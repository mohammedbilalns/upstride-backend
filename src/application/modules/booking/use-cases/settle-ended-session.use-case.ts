import { inject, injectable } from "inversify";
import type { Booking } from "../../../../domain/entities/booking.entity";
import type { IBookingRepository } from "../../../../domain/repositories/booking.repository.interface";
import logger from "../../../../shared/logging/logger";
import { TYPES } from "../../../../shared/types/types";
import type { MentorNoShowService } from "../services/mentor-no-show.service";
import type { MentorSessionPayoutService } from "../services/mentor-session-payout.service";
import type { SessionRefundService } from "../services/session-refund.service";
import type { SessionSettlementCalculatorService } from "../services/session-settlement-calculator.service";
import type {
	ISettleEndedSessionUseCase,
	SettleEndedSessionInput,
} from "./settle-ended-session.use-case.interface";

@injectable()
export class SettleEndedSessionUseCase implements ISettleEndedSessionUseCase {
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
		@inject(TYPES.Services.SessionSettlementCalculator)
		private readonly _settlementCalculator: SessionSettlementCalculatorService,
		@inject(TYPES.Services.MentorSessionPayout)
		private readonly _mentorSessionPayout: MentorSessionPayoutService,
		@inject(TYPES.Services.SessionRefund)
		private readonly _sessionRefund: SessionRefundService,
		@inject(TYPES.Services.MentorNoShow)
		private readonly _mentorNoShow: MentorNoShowService,
	) {}

	async execute(input: SettleEndedSessionInput): Promise<void> {
		const booking = await this._bookingRepository.findById(input.bookingId);
		if (!booking) {
			logger.warn({ bookingId: input.bookingId }, "Booking not found");
			return;
		}

		if (booking.settledAt) {
			return;
		}

		if (booking.paymentStatus !== "COMPLETED") {
			await this._bookingRepository.updateById(booking.id, {
				settledAt: new Date(),
			});
			return;
		}

		const settledAt = new Date();
		const amounts = this._settlementCalculator.calculate(booking);

		if (this._mentorJoined(booking)) {
			if (booking.mentorUserId) {
				await this._mentorSessionPayout.creditMentor(
					booking,
					booking.mentorUserId,
					amounts.mentorCoins,
					amounts.mentorPayoutMinor,
					settledAt,
				);
			}
		} else if (booking.mentorUserId) {
			const skippedSessions = await this._mentorNoShow.recordNoShow(
				booking.mentorUserId,
			);

			if (skippedSessions >= 2) {
				await this._mentorNoShow.blockMentor(booking.mentorUserId);
				await this._sessionRefund.refundBookedUser(
					booking,
					amounts.refundCoins,
					amounts.refundMinor,
					settledAt,
				);
			}
		}

		await this._bookingRepository.updateById(booking.id, { settledAt });
	}

	private _mentorJoined(booking: Booking): boolean {
		return booking.status === "STARTED" || booking.status === "COMPLETED";
	}
}

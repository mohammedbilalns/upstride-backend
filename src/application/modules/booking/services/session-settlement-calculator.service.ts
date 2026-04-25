import { injectable } from "inversify";
import type { Booking } from "../../../../domain/entities/booking.entity";
import { COIN_VALUE, PLATFOM_COMMISSION } from "../../../../shared/constants";

export interface SessionSettlementAmounts {
	mentorCoins: number;
	mentorPayoutMinor: number;
	refundCoins: number;
	refundMinor: number;
}

@injectable()
export class SessionSettlementCalculatorService {
	calculate(booking: Booking): SessionSettlementAmounts {
		const mentorPercentage = Math.max(
			0,
			100 - PLATFOM_COMMISSION.SESSION_PERCENTAGE,
		);

		if (booking.paymentType === "COINS") {
			const refundCoins = Math.round(booking.totalAmount);
			return {
				mentorCoins: Math.round((booking.totalAmount * mentorPercentage) / 100),
				mentorPayoutMinor: Math.round(
					(booking.totalAmount / COIN_VALUE) * 100 * (mentorPercentage / 100),
				),
				refundCoins,
				refundMinor: Math.round((booking.totalAmount / COIN_VALUE) * 100),
			};
		}

		return {
			mentorCoins: Math.round(
				booking.totalAmount * COIN_VALUE * (mentorPercentage / 100),
			),
			mentorPayoutMinor: Math.round(
				booking.totalAmount * 100 * (mentorPercentage / 100),
			),
			refundCoins: Math.round(booking.totalAmount * COIN_VALUE),
			refundMinor: Math.round(booking.totalAmount * 100),
		};
	}
}

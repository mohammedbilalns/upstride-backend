import { COIN_VALUE } from "../../../../shared/constants";

export function calculateBookingAmount(
	pricePer30Min: number,
	start: Date,
	end: Date,
) {
	const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
	const totalAmountCoins = (durationMinutes / 30) * pricePer30Min;
	const totalAmountCurrency = totalAmountCoins / COIN_VALUE;
	return { totalAmountCurrency, totalAmountCoins };
}

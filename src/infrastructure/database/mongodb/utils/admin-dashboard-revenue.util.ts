import {
	roundToTwo,
	toMonetaryBookingAmount,
} from "./effective-platform-revenue.util";

interface PaymentAmountLike {
	amount: number;
	providerPaymentId: string;
}

interface RevenueBookingLike {
	paymentType: "STRIPE" | "COINS";
	totalAmount: number;
}

interface CancelledBookingLike extends RevenueBookingLike {
	_id: string;
	status: string;
	paymentStatus: string;
}

interface UpcomingBookingLike {
	status: string;
	paymentStatus: string;
	endTime: Date;
}

export const getPlatformRevenueAmount = (
	booking: Pick<RevenueBookingLike, "paymentType" | "totalAmount">,
): number => roundToTwo(toMonetaryBookingAmount(booking) * 0.15);

export const isMenteeCancelledBooking = (
	booking: Pick<CancelledBookingLike, "status" | "paymentStatus">,
) =>
	booking.status === "CANCELLED_BY_MENTEE" &&
	booking.paymentStatus === "COMPLETED";

export const buildRefundAmountMap = (
	payments: PaymentAmountLike[],
): Map<string, number> =>
	payments.reduce<Map<string, number>>((map, payment) => {
		if (!payment.providerPaymentId.startsWith("refund_")) {
			return map;
		}

		map.set(
			payment.providerPaymentId.replace(/^refund_/, ""),
			Math.abs(payment.amount),
		);
		return map;
	}, new Map<string, number>());

export const getRetainedRefundAmount = (
	booking: Pick<CancelledBookingLike, "_id" | "paymentType" | "totalAmount">,
	refundAmounts: Map<string, number>,
) =>
	roundToTwo(
		Math.max(
			0,
			toMonetaryBookingAmount(booking) -
				(refundAmounts.get(booking._id) ?? 0) / 100,
		),
	);

export const isUpcomingBooking = (
	booking: Pick<UpcomingBookingLike, "status" | "paymentStatus" | "endTime">,
	now: Date,
) =>
	booking.endTime.getTime() > now.getTime() &&
	booking.paymentStatus !== "FAILED" &&
	["PENDING", "CONFIRMED", "STARTED"].includes(booking.status);

export const isCompletedBooking = (
	booking: Pick<CancelledBookingLike, "status" | "paymentStatus">,
) => booking.status === "COMPLETED" && booking.paymentStatus === "COMPLETED";

export const isCancelledBooking = (
	booking: Pick<UpcomingBookingLike, "status">,
) => ["CANCELLED_BY_MENTEE", "CANCELLED_BY_MENTOR"].includes(booking.status);

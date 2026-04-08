import type { PaymentType } from "../../../../domain/entities/booking.entity";

export interface RefundParams {
	bookingId: string;
	userId: string;
	refundAmount: number;
	refundAmountMinor: number;
	cancelledBy: "user" | "mentor";
	paymentType: PaymentType;
}

export interface IRefundService {
	processRefund(params: RefundParams): Promise<void>;
}

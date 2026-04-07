export interface RefundParams {
	bookingId: string;
	userId: string;
	refundAmount: number;
	refundAmountMinor: number;
	cancelledBy: "user" | "mentor";
}

export interface IRefundService {
	processRefund(params: RefundParams): Promise<void>;
}

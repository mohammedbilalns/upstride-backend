import type { PaymentStatus, PaymentType } from "../entities/booking.entity";
import { AppEvent } from "./app-event";

export type SessionRefundedPayload = {
	bookingId: string;
	userId: string;
	refundAmount: number;
	refundPercentage: number;
	reason: string;
	paymentType: PaymentType;
	paymentStatus: PaymentStatus;
};

export class SessionRefundedEvent extends AppEvent {
	readonly eventName = "session.refunded";

	constructor(public readonly payload: SessionRefundedPayload) {
		super();
	}
}

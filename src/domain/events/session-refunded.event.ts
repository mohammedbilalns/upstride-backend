import type { PaymentStatus, PaymentType } from "../entities/booking.entity";
import { DomainEvent } from "./domain-event";

export type SessionRefundedPayload = {
	bookingId: string;
	userId: string;
	refundAmount: number;
	refundPercentage: number;
	reason: string;
	paymentType: PaymentType;
	paymentStatus: PaymentStatus;
};

export class SessionRefundedEvent extends DomainEvent {
	readonly eventName = "session.refunded";

	constructor(public readonly payload: SessionRefundedPayload) {
		super();
	}
}

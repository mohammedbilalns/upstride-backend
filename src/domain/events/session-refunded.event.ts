import type {
	PaymentStatus,
	PaymentType,
} from "../entities/booking.entity";
import { AppEvent } from "./domain-event";

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
	constructor(public readonly payload: SessionRefundedPayload) {
		super();
	}
}

import { Slot } from "./slot.entity";
import { userData } from "../../common/types/user.types";
import { PaymentDetails } from "../../common/types/payment.types";

export enum BookingStatus {
	PENDING = "PENDING",
	CONFIRMED = "CONFIRMED",
	CANCELLED = "CANCELLED",
	REFUNDED = "REFUNDED",
}
export interface Booking {
	id: string;
	slotId: string;
	slot?: Slot;
	userId: string;
	status: BookingStatus;
	paymentId: string;
	rescheduleRequest?: {
		requestedSlotId: string;
		reason?: string;
		isStudentRequest: boolean;
		status: "PENDING" | "REJECTED" | "APPROVED";
		createdAt: Date;
	};
	createdAt: Date;
	userDetails?: userData;
	mentorDetails?: userData;
	paymentDetails?: PaymentDetails;
}

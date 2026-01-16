import { Schema, model, Document } from "mongoose";
import { Payment } from "../../../domain/entities/payment.entity";

export interface IPaymentDocument extends Document, Omit<Payment, "id"> { }

const paymentSchema = new Schema(
	{
		userId: { type: String, required: true },
		mentorId: { type: String, required: false },
		bookingId: { type: String },
		sessionId: { type: String },
		amount: { type: Number, required: true },
		currency: { type: String, required: true, default: "USD" },
		status: {
			type: String,
			enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
			default: "PENDING",
		},
		transactionId: { type: String },
		orderId: { type: String, required: true },
		paymentMethod: { type: String, default: "PAYPAL" },
		purpose: {
			type: String,
			enum: ["BOOKING", "WALLET_LOAD"],
			default: "BOOKING",
		},
	},
	{ timestamps: true },
);

export const PaymentModel = model<IPaymentDocument>("Payment", paymentSchema);

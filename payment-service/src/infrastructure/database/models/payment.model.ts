import { Schema, model, Document } from "mongoose";
import { Payment } from "../../../domain/entities/payment.entity";

export interface IPaymentDocument extends Document, Omit<Payment, "id"> {}

const paymentSchema = new Schema(
	{
		userId: { type: String, required: true },
		mentorId: { type: String, required: true },
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
		paymentMethod: { type: String, default: "PAYPAL" },
	},
	{ timestamps: true },
);

export const PaymentModel = model<IPaymentDocument>("Payment", paymentSchema);

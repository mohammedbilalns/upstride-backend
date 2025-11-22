import { Document, model, Schema, Types } from "mongoose";
import { Booking } from "../../../domain/entities/booking.entity";

export interface IBooking extends Document, Omit<Booking, "id"> {}

export const bookingSchema: Schema = new Schema(
	{
		slotId: { type: Types.ObjectId, ref: "Slot", required: true },
		userId: { type: String, required: true },
		status: {
			type: String,
			enum: ["PENDING", "CONFIRMED", "CANCELLED", "REFUNDED"],
		},
		paymentId: { type: String, required: true },
	},
	{ timestamps: true },
);

export const bookingModel = model<IBooking>("Booking", bookingSchema);

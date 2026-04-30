import type { Types } from "mongoose";
import type {
	BookingStatus,
	PaymentStatus,
	PaymentType,
} from "../../../../domain/entities/booking.entity";
import { Booking } from "../../../../domain/entities/booking.entity";
import { toHHMM } from "../../../../shared/utilities/time.util";
import type { BookingDocument } from "../models/booking.model";

export class BookingMapper {
	static toDomain(doc: BookingDocumentWithMentorAndMentee): Booking {
		const mentorId = getMentorIdString(doc.mentorId);
		const mentorUserId = getMentorUserIdString(doc.mentorId);
		const mentorName = isPopulatedMentorRef(doc.mentorId)
			? (doc.mentorId.userId?.name ?? null)
			: null;
		const menteeName = isPopulatedMenteeRef(doc.menteeId)
			? (doc.menteeId.name ?? null)
			: null;
		const menteeId = getMenteeIdString(doc.menteeId);

		return new Booking(
			doc._id.toString(),
			mentorId,
			mentorUserId,
			menteeId,
			doc.startTime.toISOString(),
			doc.endTime.toISOString(),
			doc.status as BookingStatus,
			doc.meetingLink,
			doc.paymentType as PaymentType,
			doc.paymentStatus as PaymentStatus,
			doc.totalAmount,
			doc.currency,
			doc.notes,
			menteeName,
			mentorName,
			doc.mentorJoinedAt ?? null,
			doc.settledAt ?? null,
			doc.feedback ?? null,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toPersistence(
		entity: Omit<Booking, "id" | "createdAt" | "updatedAt">,
	) {
		return {
			mentorId: entity.mentorId,
			menteeId: entity.menteeId,
			startTime: entity.startTime,
			endTime: entity.endTime,
			status: entity.status,
			meetingLink: entity.meetingLink,
			paymentType: entity.paymentType,
			paymentStatus: entity.paymentStatus,
			totalAmount: entity.totalAmount,
			currency: entity.currency,
			notes: entity.notes,
			mentorJoinedAt: entity.mentorJoinedAt,
			settledAt: entity.settledAt,
		};
	}

	/**
	 * Converts a Booking domain entity to a client-facing DTO.
	 */
	static toDTO(booking: Booking) {
		return {
			id: booking.id,
			mentorId: booking.mentorId,
			menteeId: booking.menteeId,
			startTime: toHHMM(new Date(booking.startTime)),
			endTime: toHHMM(new Date(booking.endTime)),
			startDate: booking.startTime.slice(0, 10),
			status: booking.status,
			meetingLink: booking.meetingLink,
			paymentType: booking.paymentType,
			paymentStatus: booking.paymentStatus,
			totalAmount: booking.totalAmount,
			currency: booking.currency,
			notes: booking.notes,
			createdAt: booking.createdAt,
			updatedAt: booking.updatedAt,
		};
	}
}

type PopulatedMentorRef = {
	_id: Types.ObjectId;
	userId?: { _id: Types.ObjectId; name?: string };
};

type PopulatedMenteeRef = {
	_id: Types.ObjectId;
	name?: string;
};

type BookingDocumentWithMentorAndMentee = Omit<
	BookingDocument,
	"mentorId" | "menteeId"
> & {
	mentorId: Types.ObjectId | PopulatedMentorRef;
	menteeId: Types.ObjectId | PopulatedMenteeRef;
};

const isPopulatedMentorRef = (
	mentorId: Types.ObjectId | PopulatedMentorRef,
): mentorId is PopulatedMentorRef =>
	typeof mentorId === "object" && mentorId !== null && "_id" in mentorId;

const isPopulatedMenteeRef = (
	menteeId: Types.ObjectId | PopulatedMenteeRef,
): menteeId is PopulatedMenteeRef =>
	typeof menteeId === "object" && menteeId !== null && "_id" in menteeId;

const getMentorIdString = (
	mentorId: Types.ObjectId | PopulatedMentorRef,
): string =>
	(isPopulatedMentorRef(mentorId) ? mentorId._id : mentorId).toString();

const getMentorUserIdString = (
	mentorId: Types.ObjectId | PopulatedMentorRef,
): string | null => {
	if (!isPopulatedMentorRef(mentorId) || !mentorId.userId) return null;
	return (
		"_id" in mentorId.userId ? mentorId.userId._id : mentorId.userId
	).toString();
};

const getMenteeIdString = (
	menteeId: Types.ObjectId | PopulatedMenteeRef,
): string =>
	(isPopulatedMenteeRef(menteeId) ? menteeId._id : menteeId).toString();

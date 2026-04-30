import type { Booking } from "../../../../domain/entities/booking.entity";
import { PLATFOM_COMMISSION } from "../../../../shared/constants";
import type { BookingDto } from "../dtos/booking.dto";

export class BookingMapper {
	static toDto(entity: Booking): BookingDto {
		const mentorPercentage = Math.max(
			0,
			100 - PLATFOM_COMMISSION.SESSION_PERCENTAGE,
		);
		const mentorPayoutAmount =
			entity.paymentType === "COINS"
				? Math.round((entity.totalAmount * mentorPercentage) / 100)
				: Number(((entity.totalAmount * mentorPercentage) / 100).toFixed(2));

		return {
			id: entity.id,
			mentorId: entity.mentorId,
			mentorUserId: entity.mentorUserId,
			menteeId: entity.menteeId,
			startTime: entity.startTime,
			endTime: entity.endTime,
			startDate: entity.startTime.split("T")[0],
			status: entity.status,
			paymentType: entity.paymentType,
			paymentStatus: entity.paymentStatus,
			totalAmount: entity.totalAmount,
			currency: entity.currency,
			mentorPayout: {
				amount: mentorPayoutAmount,
				currency: entity.paymentType === "COINS" ? "COINS" : entity.currency,
				percentage: mentorPercentage,
			},
			meetingLink: entity.meetingLink,
			notes: entity.notes,
			menteeName: entity.menteeName ?? null,
			mentorName: entity.mentorName ?? null,
			feedback: entity.feeback ?? null,
			review: null,
			settledAt: entity.settledAt ? entity.settledAt.toISOString() : null,
			createdAt: entity.createdAt.toISOString(),
			updatedAt: entity.updatedAt.toISOString(),
		};
	}

	static toDtos(entities: Booking[]): BookingDto[] {
		return entities.map((entity) => BookingMapper.toDto(entity));
	}
}

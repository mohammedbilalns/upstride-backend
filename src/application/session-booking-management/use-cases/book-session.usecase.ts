import { inject, injectable } from "inversify";
import { SessionBooking } from "../../../domain/entities/session-booking.entity";
import type { IMentorRepository } from "../../../domain/repositories/mentor.repository.interface";
import type { ISessionBookingRepository } from "../../../domain/repositories/session-booking.repository.interface";
import type { ISessionSlotRepository } from "../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../shared/types/types";
import { MentorNotFoundError } from "../../mentor-lists/errors";
import type { IIdGenerator } from "../../services/id-generator.service.interface";
import { SlotNotFoundError } from "../../session-slot-management/errors";
import type {
	BookSessionInput,
	BookSessionResponse,
} from "../dtos/session-booking.dto";
import { SlotNotAvailableError } from "../errors/slot-not-available.error";
import type { IBookSessionUseCase } from "./book-session.usecase.interface";

@injectable()
export class BookSessionUseCase implements IBookSessionUseCase {
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
		@inject(TYPES.Repositories.SessionSlotRepository)
		private readonly _slotRepository: ISessionSlotRepository,
		@inject(TYPES.Repositories.SessionBookingRepository)
		private readonly _bookingRepository: ISessionBookingRepository,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
	) {}

	async execute({
		userId,
		slotId,
		coinsDebited,
		transactionId,
	}: BookSessionInput): Promise<BookSessionResponse> {
		const slot = await this._slotRepository.findById(slotId);
		if (!slot) {
			throw new SlotNotFoundError();
		}
		if (slot.status !== "available") {
			throw new SlotNotAvailableError();
		}

		const mentor = await this._mentorRepository.findById(slot.mentorId);
		if (!mentor) {
			throw new MentorNotFoundError();
		}

		const booking = new SessionBooking(
			this._idGenerator.generate(),
			userId,
			mentor.id,
			slot.id,
			slot.startTime,
			slot.endTime,
			slot.price,
			"confirmed",
			{
				coinsDebited,
				transactionId,
			},
			{},
			new Date(),
			new Date(),
		);

		const created = await this._bookingRepository.create(booking);
		await this._slotRepository.updateById(slot.id, {
			status: "booked",
			bookingId: created.id,
		});

		return { bookingId: created.id };
	}
}

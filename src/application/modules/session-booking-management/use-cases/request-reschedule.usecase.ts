import { inject, injectable } from "inversify";
import type { ISessionBookingRepository } from "../../../../domain/repositories/session-booking.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { PlatformSettingsService } from "../../../services/platform-settings.service";
import type {
	RequestRescheduleInput,
	RequestRescheduleResponse,
} from "../dtos/session-booking.dto";
import {
	BookingNotConfirmedForRescheduleError,
	BookingNotFoundError,
	RescheduleWindowPassedError,
} from "../errors";
import type { IRequestRescheduleUseCase } from "./request-reschedule.usecase.interface";

@injectable()
export class RequestRescheduleUseCase implements IRequestRescheduleUseCase {
	constructor(
		@inject(TYPES.Repositories.SessionBookingRepository)
		private readonly _bookingRepository: ISessionBookingRepository,
		@inject(TYPES.Services.PlatformSettings)
		private readonly _platformSettingsService: PlatformSettingsService,
	) {}

	async execute({
		userId,
		bookingId,
	}: RequestRescheduleInput): Promise<RequestRescheduleResponse> {
		const booking = await this._bookingRepository.findById(bookingId);
		if (!booking || booking.userId !== userId) {
			throw new BookingNotFoundError();
		}

		if (booking.status !== "confirmed") {
			throw new BookingNotConfirmedForRescheduleError();
		}

		const hours = this._platformSettingsService.sessions.rescheduleWindowHours;
		const latest = new Date(booking.startTime);
		latest.setHours(latest.getHours() - hours);
		if (new Date() > latest) {
			throw new RescheduleWindowPassedError();
		}

		await this._bookingRepository.updateById(bookingId, {
			status: "pending",
			updatedAt: new Date(),
		});

		return { bookingId, status: "pending" };
	}
}

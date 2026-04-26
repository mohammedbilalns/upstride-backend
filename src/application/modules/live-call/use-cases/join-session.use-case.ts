import { inject, injectable } from "inversify";
import type { IBookingRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { BookingNotFoundError } from "../../booking/errors/booking.errors";
import type {
	JoinSessionInput,
	JoinSessionOutput,
} from "../dtos/join-session.dto";
import type { IJoinSessionUseCase } from "./join-session.use-case.interface";
import type { IValidateJoinSessionUseCase } from "./validate-join-session.use-case.interface";

@injectable()
export class JoinSessionUseCase implements IJoinSessionUseCase {
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private _bookingRepository: IBookingRepository,
		@inject(TYPES.UseCases.ValidateJoinSession)
		private _validateJoinSessionUseCase: IValidateJoinSessionUseCase,
	) {}
	async execute(input: JoinSessionInput): Promise<JoinSessionOutput> {
		await this._validateJoinSessionUseCase.execute(input);

		const booking = await this._bookingRepository.findById(input.bookingId);
		if (!booking) {
			throw new BookingNotFoundError();
		}

		if (this._isHostingMentor(booking.mentorUserId, input.userId)) {
			const nextUpdate: {
				status?: "STARTED";
				mentorJoinedAt?: Date;
			} = {};

			if (booking.status === "CONFIRMED") {
				nextUpdate.status = "STARTED";
			}

			if (!booking.mentorJoinedAt) {
				nextUpdate.mentorJoinedAt = new Date();
			}

			if (Object.keys(nextUpdate).length > 0) {
				await this._bookingRepository.updateById(booking.id, nextUpdate);
			}
		}

		return { roomId: booking.id };
	}

	private _isHostingMentor(
		mentorUserId: string | null,
		userId: string,
	): boolean {
		return mentorUserId === userId;
	}
}

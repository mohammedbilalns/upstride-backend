import { inject, injectable } from "inversify";
import type { IBookingRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
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

		//FIX: remove the non null assertion
		const booking = (await this._bookingRepository.findById(input.bookingId))!;

		if (
			booking.mentorUserId === input.userId &&
			booking.status === "CONFIRMED"
		) {
			await this._bookingRepository.updateById(booking.id, {
				status: "STARTED",
			});
		}

		return { roomId: booking.id };
	}
}

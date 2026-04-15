import { inject, injectable } from "inversify";
import type { IBookingRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { UnauthorizedError } from "../../authentication/errors";
import { BookingNotFoundError } from "../../booking-management/errors/booking.errors";
import type { AuthorizeWhiteboardPermissionInput } from "../dtos/authorize-whiteboard-permission.dto";
import type { IAuthorizeWhiteboardPermissionUseCase } from "./authorize-whiteboard-permission.usecase.interface";

@injectable()
export class AuthorizeWhiteboardPermissionUseCase
	implements IAuthorizeWhiteboardPermissionUseCase
{
	constructor(
		@inject(TYPES.Repositories.BookingRepository)
		private readonly _bookingRepository: IBookingRepository,
	) {}

	async execute(input: AuthorizeWhiteboardPermissionInput): Promise<void> {
		const booking = await this._bookingRepository.findById(input.bookingId);

		if (!booking) {
			throw new BookingNotFoundError();
		}

		if (booking.mentorUserId !== input.userId) {
			throw new UnauthorizedError(
				"You are not authorized to manage whiteboard permissions for this session",
			);
		}
	}
}

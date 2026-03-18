import { inject, injectable } from "inversify";
import type { ISessionBookingRepository } from "../../../domain/repositories/session-booking.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type {
	GetBookingsInput,
	GetBookingsResponse,
} from "../dtos/get-bookings.dto";
import { SessionBookingDtoMapper } from "../mappers/session-booking.mapper";
import type { IGetUserBookingsUseCase } from "./get-user-bookings.usecase.interface";

@injectable()
export class GetUserBookingsUseCase implements IGetUserBookingsUseCase {
	constructor(
		@inject(TYPES.Repositories.SessionBookingRepository)
		private readonly _bookingRepository: ISessionBookingRepository,
	) {}

	async execute({
		userId,
		filter,
		page,
		limit,
	}: GetBookingsInput): Promise<GetBookingsResponse> {
		const result = await this._bookingRepository.paginateByUser(
			userId,
			filter,
			page,
			limit,
		);

		return {
			...result,
			items: SessionBookingDtoMapper.toListItems(result.items),
		};
	}
}

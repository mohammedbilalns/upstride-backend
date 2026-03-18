import type { Container } from "inversify";
import {
	BookSessionUseCase,
	CancelBookingUseCase,
	GetMentorBookingsUseCase,
	GetUserBookingsUseCase,
	HandleRescheduleUseCase,
	type IBookSessionUseCase,
	type ICancelBookingUseCase,
	type IGetMentorBookingsUseCase,
	type IGetUserBookingsUseCase,
	type IHandleRescheduleUseCase,
	type IRequestRescheduleUseCase,
	RequestRescheduleUseCase,
} from "../../application/session-booking-management/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerSessionBookingBindings = (container: Container): void => {
	container
		.bind<IBookSessionUseCase>(TYPES.UseCases.BookSession)
		.to(BookSessionUseCase);
	container
		.bind<ICancelBookingUseCase>(TYPES.UseCases.CancelBooking)
		.to(CancelBookingUseCase);
	container
		.bind<IRequestRescheduleUseCase>(TYPES.UseCases.RequestReschedule)
		.to(RequestRescheduleUseCase);
	container
		.bind<IHandleRescheduleUseCase>(TYPES.UseCases.HandleReschedule)
		.to(HandleRescheduleUseCase);
	container
		.bind<IGetUserBookingsUseCase>(TYPES.UseCases.GetUserBookings)
		.to(GetUserBookingsUseCase);
	container
		.bind<IGetMentorBookingsUseCase>(TYPES.UseCases.GetMentorBookings)
		.to(GetMentorBookingsUseCase);
};

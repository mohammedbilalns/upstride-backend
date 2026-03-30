import type { Container } from "inversify";
import { CancelBookingUseCase } from "../../application/modules/booking-management/use-cases/cancel-booking.usecase";
import type { ICancelBookingUseCase } from "../../application/modules/booking-management/use-cases/cancel-booking.usecase.interface";
import { CancelBookingByMentorUseCase } from "../../application/modules/booking-management/use-cases/cancel-booking-by-mentor.usecase";
import type { ICancelBookingByMentorUseCase } from "../../application/modules/booking-management/use-cases/cancel-booking-by-mentor.usecase.interface";
import { CreateBookingUseCase } from "../../application/modules/booking-management/use-cases/create-booking.usecase";
import type { ICreateBookingUseCase } from "../../application/modules/booking-management/use-cases/create-booking.usecase.interface";
import { GetAvailableSlotsUseCase } from "../../application/modules/booking-management/use-cases/get-available-slots.usecase";
import type { IGetAvailableSlotsUseCase } from "../../application/modules/booking-management/use-cases/get-available-slots.usecase.interface";
import { GetMentorBookingsUseCase } from "../../application/modules/booking-management/use-cases/get-mentor-bookings.usecase";
import type { IGetMentorBookingsUseCase } from "../../application/modules/booking-management/use-cases/get-mentor-bookings.usecase.interface";
import { GetUserBookingsUseCase } from "../../application/modules/booking-management/use-cases/get-user-bookings.usecase";
import type { IGetUserBookingsUseCase } from "../../application/modules/booking-management/use-cases/get-user-bookings.usecase.interface";
import { BookingController } from "../../presentation/http/controllers/booking.controller";
import { TYPES } from "../../shared/types/types";

export const registerBookingBindings = (container: Container): void => {
	// Use Cases
	container
		.bind<IGetAvailableSlotsUseCase>(TYPES.UseCases.GetAvailableSlots)
		.to(GetAvailableSlotsUseCase)
		.inSingletonScope();
	container
		.bind<ICreateBookingUseCase>(TYPES.UseCases.CreateBooking)
		.to(CreateBookingUseCase)
		.inSingletonScope();
	container
		.bind<ICancelBookingUseCase>(TYPES.UseCases.CancelBooking)
		.to(CancelBookingUseCase)
		.inSingletonScope();
	container
		.bind<ICancelBookingByMentorUseCase>(TYPES.UseCases.CancelBookingByMentor)
		.to(CancelBookingByMentorUseCase)
		.inSingletonScope();
	container
		.bind<IGetUserBookingsUseCase>(TYPES.UseCases.GetUserBookings)
		.to(GetUserBookingsUseCase)
		.inSingletonScope();
	container
		.bind<IGetMentorBookingsUseCase>(TYPES.UseCases.GetMentorBookings)
		.to(GetMentorBookingsUseCase)
		.inSingletonScope();

	// Controller
	container
		.bind<BookingController>(TYPES.Controllers.Booking)
		.to(BookingController)
		.inSingletonScope();
};

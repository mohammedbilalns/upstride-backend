import type { Container } from "inversify";
import { CancelBookingUseCase } from "../../application/modules/booking-management/use-cases/cancel-booking.use-case";
import type { ICancelBookingUseCase } from "../../application/modules/booking-management/use-cases/cancel-booking.use-case.interface";
import { CancelBookingByMentorUseCase } from "../../application/modules/booking-management/use-cases/cancel-booking-by-mentor.use-case";
import type { ICancelBookingByMentorUseCase } from "../../application/modules/booking-management/use-cases/cancel-booking-by-mentor.use-case.interface";
import { CreateBookingUseCase } from "../../application/modules/booking-management/use-cases/create-booking.use-case";
import type { ICreateBookingUseCase } from "../../application/modules/booking-management/use-cases/create-booking.use-case.interface";
import { GenerateReceiptPdfUseCase } from "../../application/modules/booking-management/use-cases/generate-receipt-pdf.use-case";
import type { IGenerateReceiptPdfUseCase } from "../../application/modules/booking-management/use-cases/generate-receipt-pdf.use-case.interface";
import { GetAvailableSlotsUseCase } from "../../application/modules/booking-management/use-cases/get-available-slots.use-case";
import type { IGetAvailableSlotsUseCase } from "../../application/modules/booking-management/use-cases/get-available-slots.use-case.interface";
import { GetBookingDetailsUseCase } from "../../application/modules/booking-management/use-cases/get-booking-details.use-case";
import type { IGetBookingDetailsUseCase } from "../../application/modules/booking-management/use-cases/get-booking-details.use-case.interface";
import { GetMentorBookingsUseCase } from "../../application/modules/booking-management/use-cases/get-mentor-bookings.use-case";
import type { IGetMentorBookingsUseCase } from "../../application/modules/booking-management/use-cases/get-mentor-bookings.use-case.interface";
import { GetUserBookingsUseCase } from "../../application/modules/booking-management/use-cases/get-user-bookings.use-case";
import type { IGetUserBookingsUseCase } from "../../application/modules/booking-management/use-cases/get-user-bookings.use-case.interface";
import { RefundSessionAmountUseCase } from "../../application/modules/booking-management/use-cases/refund-session-amount.use-case";
import type { IRefundSessionAmountUseCase } from "../../application/modules/booking-management/use-cases/refund-session-amount.use-case.interface";
import { RepayBookingUseCase } from "../../application/modules/booking-management/use-cases/repay-booking.use-case";
import type { IRepayBookingUseCase } from "../../application/modules/booking-management/use-cases/repay-booking.use-case.interface";
import { ScheduleLiveSesionReminderUseCase } from "../../application/modules/booking-management/use-cases/schedule-live-sesion-reminder.use-case";
import type { IScheduleLiveSesionReminderUseCase } from "../../application/modules/booking-management/use-cases/schedule-mentor-reminder.use-case.interface";
import { PdfReceiptService } from "../../infrastructure/services/pdf-receipt.service";
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
		.bind<IRefundSessionAmountUseCase>(TYPES.UseCases.RefundSessionAmount)
		.to(RefundSessionAmountUseCase)
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
	container
		.bind<IGetBookingDetailsUseCase>(TYPES.UseCases.GetBookingDetails)
		.to(GetBookingDetailsUseCase)
		.inSingletonScope();
	container
		.bind<IRepayBookingUseCase>(TYPES.UseCases.RepayBooking)
		.to(RepayBookingUseCase)
		.inSingletonScope();

	container
		.bind<IScheduleLiveSesionReminderUseCase>(
			TYPES.UseCases.ScheduleLiveSesionReminder,
		)
		.to(ScheduleLiveSesionReminderUseCase)
		.inSingletonScope();

	// PDF Receipt Service
	container
		.bind(TYPES.Services.PdfReceiptService)
		.to(PdfReceiptService)
		.inSingletonScope();

	// Generate Receipt PDF Use Case
	container
		.bind<IGenerateReceiptPdfUseCase>(TYPES.UseCases.GenerateReceiptPdf)
		.to(GenerateReceiptPdfUseCase)
		.inSingletonScope();

	// Controller
	container
		.bind<BookingController>(TYPES.Controllers.Booking)
		.to(BookingController)
		.inSingletonScope();
};

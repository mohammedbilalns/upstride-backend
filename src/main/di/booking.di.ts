import type { Container } from "inversify";
import { CancelBookingUseCase } from "../../application/modules/booking-management/use-cases/cancel-booking.usecase";
import type { ICancelBookingUseCase } from "../../application/modules/booking-management/use-cases/cancel-booking.usecase.interface";
import { CancelBookingByMentorUseCase } from "../../application/modules/booking-management/use-cases/cancel-booking-by-mentor.usecase";
import type { ICancelBookingByMentorUseCase } from "../../application/modules/booking-management/use-cases/cancel-booking-by-mentor.usecase.interface";
import { CreateBookingUseCase } from "../../application/modules/booking-management/use-cases/create-booking.usecase";
import type { ICreateBookingUseCase } from "../../application/modules/booking-management/use-cases/create-booking.usecase.interface";
import { GenerateReceiptPdfUseCase } from "../../application/modules/booking-management/use-cases/generate-receipt-pdf.usecase";
import type { IGenerateReceiptPdfUseCase } from "../../application/modules/booking-management/use-cases/generate-receipt-pdf.usecase.interface";
import { GetAvailableSlotsUseCase } from "../../application/modules/booking-management/use-cases/get-available-slots.usecase";
import type { IGetAvailableSlotsUseCase } from "../../application/modules/booking-management/use-cases/get-available-slots.usecase.interface";
import { GetBookingDetailsUseCase } from "../../application/modules/booking-management/use-cases/get-booking-details.usecase";
import type { IGetBookingDetailsUseCase } from "../../application/modules/booking-management/use-cases/get-booking-details.usecase.interface";
import { GetMentorBookingsUseCase } from "../../application/modules/booking-management/use-cases/get-mentor-bookings.usecase";
import type { IGetMentorBookingsUseCase } from "../../application/modules/booking-management/use-cases/get-mentor-bookings.usecase.interface";
import { GetUserBookingsUseCase } from "../../application/modules/booking-management/use-cases/get-user-bookings.usecase";
import type { IGetUserBookingsUseCase } from "../../application/modules/booking-management/use-cases/get-user-bookings.usecase.interface";
import { RefundSessionAmountUseCase } from "../../application/modules/booking-management/use-cases/refund-session-amount.usecase";
import type { IRefundSessionAmountUseCase } from "../../application/modules/booking-management/use-cases/refund-session-amount.usecase.interface";
import { RepayBookingUseCase } from "../../application/modules/booking-management/use-cases/repay-booking.usecase";
import type { IRepayBookingUseCase } from "../../application/modules/booking-management/use-cases/repay-booking.usecase.interface";
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

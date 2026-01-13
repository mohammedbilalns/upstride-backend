import { ConfirmSessionUC } from "../../../application/usecases/bookings/confirm-session.uc";
import { BookingRepository } from "../../database/repositories/booking.repository";
import { SlotRepository } from "../../database/repositories/slot.repository";
import { createPaymentVerifiedConsumer } from "../consumers/paymentVerified.consumer";

export async function composePaymentVerifiedConsumer() {
	const bookingRepository = new BookingRepository();
	const slotRepository = new SlotRepository();
	const confirmSessionUC = new ConfirmSessionUC(
		bookingRepository,
		slotRepository,
	);

	await createPaymentVerifiedConsumer(confirmSessionUC);
}

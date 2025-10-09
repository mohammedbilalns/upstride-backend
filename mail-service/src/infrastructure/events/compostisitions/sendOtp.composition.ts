import { MailService } from "../../../application/services/mail.service";
import { createSendOtpConsumer } from "../consumers/sendOtp.consumer";

export async function composeSendOtpConsumer() {
	const mailService = new MailService();
	await createSendOtpConsumer(mailService);
}

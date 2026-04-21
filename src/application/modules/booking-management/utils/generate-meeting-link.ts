import { getClientBaseUrl } from "../../../../shared/utilities/url.util";

export function generateMeetingLink(bookingId: string, paymentStatus: string) {
	return paymentStatus === "COMPLETED"
		? `${getClientBaseUrl()}/call/${bookingId}`
		: "PENDING";
}

import type { IMailTemplate } from "./mail.template";

export class RescheduleBookingMailTemplate implements IMailTemplate {
	public readonly purpose = "reschedule-booking-notification";
	public readonly subject = "Booking Rescheduled - UpStride";

	public render(data: {
		mentorName: string;
		menteeName: string;
		oldStartTime: string;
		newStartTime: string;
		newEndTime: string;
	}): { html: string; text: string } {
		const html = `
      <h1>Booking Rescheduled</h1>
      <p>Hi ${data.mentorName},</p>
      <p>${data.menteeName} has rescheduled their booking with you.</p>
      <p><strong>Original Time:</strong> ${data.oldStartTime}</p>
      <p><strong>New Time:</strong> ${data.newStartTime} - ${data.newEndTime}</p>
      <p>Please check your dashboard for more details.</p>
      <p>Best regards,<br/>The UpStride Team</p>
    `;

		const text = `
      Booking Rescheduled
      Hi ${data.mentorName},
      ${data.menteeName} has rescheduled their booking with you.
      Original Time: ${data.oldStartTime}
      New Time: ${data.newStartTime} - ${data.newEndTime}
      Please check your dashboard for more details.
      Best regards,
      The UpStride Team
    `;

		return { html, text };
	}
}

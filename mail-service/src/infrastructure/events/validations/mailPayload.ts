import { z } from "zod";
import { MailType } from "../../../common/enums/mailTypes";

export const mailPayloadSchema = z.object({
	to: z.string(),
	subject: z.string(),
	mailType: z.enum(MailType),
	otp: z.string().optional(),
	userName: z.string().optional(),
});

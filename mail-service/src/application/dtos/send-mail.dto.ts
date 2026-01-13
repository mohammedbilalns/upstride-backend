import { MailType } from "../../common/enums/mail-types";

export type SendMailDTO = {
	to: string;
	subject: string;
	mailType: MailType;
	otp?: string;
	userName?: string;
};

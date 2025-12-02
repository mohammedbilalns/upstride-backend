import { MailType } from "../../common/enums/mailTypes";

export type SendMailDTO = {
	to: string;
	subject: string;
	mailType: MailType;
	otp?: string;
	userName?: string;
};

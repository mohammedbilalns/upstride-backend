import { SendMailDTO } from "../../application/dtos/send-mail.dto";

export interface IMailService {
	sendEmail(dto: SendMailDTO): Promise<void>;
}

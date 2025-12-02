import { SendMailDTO } from "../../application/dtos/sendMail.dto";

export interface IMailService {
	sendEmail(dto: SendMailDTO): Promise<void>;
}

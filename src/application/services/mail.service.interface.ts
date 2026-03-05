import type { IMailTemplate } from "../../domain/mail/mail.template";

export interface IMailService {
	send(to: string, template: IMailTemplate, data: unknown): Promise<void>;
}

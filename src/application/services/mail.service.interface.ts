import type { IMailTemplate } from "../../domain/mail/mail.template";

//FIX:  Missing `domain/services/` directory.** Domain services (stateless operations on domain objects that don't fit on a single entity) have no home. The OTP policy classes sit in `domain/policies/` which is good, but business logic like "calculate refund amount" or "validate mentor tier transition" is currently inline in use cases. A `domain/services/` directory would give these a proper home.
//
export interface IMailService {
	send(to: string, template: IMailTemplate, data: unknown): Promise<void>;
}

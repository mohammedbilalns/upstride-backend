import { WebhookEventDto } from "../../application/dtos/payment.dto";

export interface IHandleWebhookUC {
	execute(event: WebhookEventDto): Promise<void>;
}

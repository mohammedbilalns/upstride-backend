import type { SendMessageInput } from "../../application/dtos/send-message.dto";

export interface ISendMessageUC {
	execute(messageData: SendMessageInput): Promise<void>;
}

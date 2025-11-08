import { SendMessageInput } from "../../application/dtos/sendMessage.dto";

export interface ISendMessageUC {
	execute(messageData: SendMessageInput): Promise<void>;
}

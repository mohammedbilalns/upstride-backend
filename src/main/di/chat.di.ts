import type { Container } from "inversify";
import {
	CreateChatUseCase,
	GetChatsUseCase,
	GetChatUseCase,
	MarkMessagesReadUseCase,
	SendMessageUseCase,
} from "../../application/modules/chat-management/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerChatBindings = (container: Container): void => {
	container.bind(TYPES.UseCases.GetChats).to(GetChatsUseCase);
	container.bind(TYPES.UseCases.GetChat).to(GetChatUseCase);
	container.bind(TYPES.UseCases.CreateChat).to(CreateChatUseCase);
	container.bind(TYPES.UseCases.SendChatMessage).to(SendMessageUseCase);
	container
		.bind(TYPES.UseCases.MarkChatMessagesRead)
		.to(MarkMessagesReadUseCase);
};

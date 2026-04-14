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
	container
		.bind(TYPES.UseCases.GetChats)
		.to(GetChatsUseCase)
		.inSingletonScope();
	container.bind(TYPES.UseCases.GetChat).to(GetChatUseCase).inSingletonScope();
	container
		.bind(TYPES.UseCases.CreateChat)
		.to(CreateChatUseCase)
		.inSingletonScope();
	container
		.bind(TYPES.UseCases.SendChatMessage)
		.to(SendMessageUseCase)
		.inSingletonScope();
	container
		.bind(TYPES.UseCases.MarkChatMessagesRead)
		.to(MarkMessagesReadUseCase)
		.inSingletonScope();
};

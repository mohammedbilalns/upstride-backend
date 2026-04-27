import type { GetChatsInput, GetChatsOutput } from "../dtos/chat.dto";

export interface IGetChatsUseCase {
	execute(input: GetChatsInput): Promise<GetChatsOutput>;
}

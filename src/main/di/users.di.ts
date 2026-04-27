import type { Container } from "inversify";
import {
	BlockUserUseCase,
	GetUsersUseCase,
	UnblockUserUseCase,
} from "../../application/modules/user-moderation/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerUsersBindings = (container: Container): void => {
	// usecases
	container
		.bind(TYPES.UseCases.GetUsers)
		.to(GetUsersUseCase)
		.inSingletonScope();
	container
		.bind(TYPES.UseCases.BlockUser)
		.to(BlockUserUseCase)
		.inSingletonScope();
	container
		.bind(TYPES.UseCases.UnblockUser)
		.to(UnblockUserUseCase)
		.inSingletonScope();
};

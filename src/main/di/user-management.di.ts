import type { Container } from "inversify";
import {
	BlockUserUseCase,
	GetUsersUseCase,
	UnblockUserUseCase,
} from "../../application/user-management/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerUserManagementBindings = (container: Container): void => {
	// usecases
	container.bind(TYPES.UseCases.GetUsers).to(GetUsersUseCase);
	container.bind(TYPES.UseCases.BlockUser).to(BlockUserUseCase);
	container.bind(TYPES.UseCases.UnblockUser).to(UnblockUserUseCase);
};

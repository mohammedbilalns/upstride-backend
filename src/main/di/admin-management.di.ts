import type { Container } from "inversify";
import {
	BlockAdminUseCase,
	CreateAdminUseCase,
	GetAdminsUseCase,
	type IBlockAdminUseCase,
	type ICreateAdminUseCase,
	type IGetAdminsUseCase,
	type IUnblockAdminUseCase,
	UnblockAdminUseCase,
} from "../../application/modules/admin-management/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerAdminManagementBindings = (container: Container): void => {
	container
		.bind<IGetAdminsUseCase>(TYPES.UseCases.GetAdmins)
		.to(GetAdminsUseCase)
		.inSingletonScope();
	container
		.bind<ICreateAdminUseCase>(TYPES.UseCases.CreateAdmin)
		.to(CreateAdminUseCase)
		.inSingletonScope();
	container
		.bind<IBlockAdminUseCase>(TYPES.UseCases.BlockAdmin)
		.to(BlockAdminUseCase)
		.inSingletonScope();
	container
		.bind<IUnblockAdminUseCase>(TYPES.UseCases.UnblockAdmin)
		.to(UnblockAdminUseCase)
		.inSingletonScope();
};

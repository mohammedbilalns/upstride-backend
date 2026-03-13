import type { Container } from "inversify";
import {
	ChangePasswordUseCase,
	GetProfileUseCase,
	type IChangePasswordUseCase,
	type IGetProfileUseCase,
	type IRequestChangePasswordUseCase,
	type IUpdateProfileUseCase,
	RequestChangePasswordUseCase,
	UpdateProfileUseCase,
} from "../../application/profile-management/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerProfileBindings = (container: Container): void => {
	// usecasese
	container
		.bind<IGetProfileUseCase>(TYPES.UseCases.GetProfile)
		.to(GetProfileUseCase)
		.inSingletonScope();
	container
		.bind<IUpdateProfileUseCase>(TYPES.UseCases.UpdateProfile)
		.to(UpdateProfileUseCase)
		.inSingletonScope();
	container
		.bind<IRequestChangePasswordUseCase>(TYPES.UseCases.RequestChangePassword)
		.to(RequestChangePasswordUseCase);
	container
		.bind<IChangePasswordUseCase>(TYPES.UseCases.ChangePassword)
		.to(ChangePasswordUseCase);
};

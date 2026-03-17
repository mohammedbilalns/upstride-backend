import type { Container } from "inversify";
import {
	GetMentorsUseCase,
	type IGetMentorsUseCase,
} from "../../application/mentor-discovery/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerMentorDiscoveryBindings = (container: Container): void => {
	container
		.bind<IGetMentorsUseCase>(TYPES.UseCases.GetMentorsDiscovery)
		.to(GetMentorsUseCase)
		.inSingletonScope();
};

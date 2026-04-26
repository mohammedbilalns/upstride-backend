import type { Container } from "inversify";
import {
	GetMentorFeedUseCase,
	GetMentorsUseCase,
	type IGetMentorFeedUseCase,
	type IGetMentorsUseCase,
} from "../../application/modules/mentor-discovery/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerMentorDiscoveryBindings = (container: Container): void => {
	container
		.bind<IGetMentorFeedUseCase>(TYPES.UseCases.GetMentorFeed)
		.to(GetMentorFeedUseCase)
		.inSingletonScope();
	container
		.bind<IGetMentorsUseCase>(TYPES.UseCases.GetMentorsDiscovery)
		.to(GetMentorsUseCase)
		.inSingletonScope();
};

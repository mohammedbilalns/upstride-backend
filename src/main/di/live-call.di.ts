import type { Container } from "inversify";
import { JoinSessionUseCase } from "../../application/modules/live-call/usecases/join-session.usecase";
import type { IJoinSessionUseCase } from "../../application/modules/live-call/usecases/join-session.usecase.interface";
import { TerminateSessionUseCase } from "../../application/modules/live-call/usecases/terminate-session.usecase";
import type { ITerminateSessionUseCase } from "../../application/modules/live-call/usecases/terminate-session.usecase.interface";
import { TYPES } from "../../shared/types/types";

export const registerLiveCallBindings = (container: Container): void => {
	container
		.bind<IJoinSessionUseCase>(TYPES.UseCases.JoinSession)
		.to(JoinSessionUseCase)
		.inSingletonScope();
	container
		.bind<ITerminateSessionUseCase>(TYPES.UseCases.TerminateSession)
		.to(TerminateSessionUseCase)
		.inSingletonScope();
};

import type { Container } from "inversify";
import { AuthorizeWhiteboardPermissionUseCase } from "../../application/modules/live-call/usecases/authorize-whiteboard-permission.usecase";
import type { IAuthorizeWhiteboardPermissionUseCase } from "../../application/modules/live-call/usecases/authorize-whiteboard-permission.usecase.interface";
import { JoinSessionUseCase } from "../../application/modules/live-call/usecases/join-session.usecase";
import type { IJoinSessionUseCase } from "../../application/modules/live-call/usecases/join-session.usecase.interface";
import { TerminateSessionUseCase } from "../../application/modules/live-call/usecases/terminate-session.usecase";
import type { ITerminateSessionUseCase } from "../../application/modules/live-call/usecases/terminate-session.usecase.interface";
import { ValidateJoinSessionUseCase } from "../../application/modules/live-call/usecases/validate-join-session.usecase";
import type { IValidateJoinSessionUseCase } from "../../application/modules/live-call/usecases/validate-join-session.usecase.interface";
import { TYPES } from "../../shared/types/types";

export const registerLiveCallBindings = (container: Container): void => {
	container
		.bind<IJoinSessionUseCase>(TYPES.UseCases.JoinSession)
		.to(JoinSessionUseCase)
		.inSingletonScope();
	container
		.bind<IValidateJoinSessionUseCase>(TYPES.UseCases.ValidateJoinSession)
		.to(ValidateJoinSessionUseCase)
		.inSingletonScope();
	container
		.bind<ITerminateSessionUseCase>(TYPES.UseCases.TerminateSession)
		.to(TerminateSessionUseCase)
		.inSingletonScope();
	container
		.bind<IAuthorizeWhiteboardPermissionUseCase>(
			TYPES.UseCases.AuthorizeWhiteboardPermission,
		)
		.to(AuthorizeWhiteboardPermissionUseCase)
		.inSingletonScope();
};

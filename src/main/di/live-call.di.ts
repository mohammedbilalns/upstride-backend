import type { Container } from "inversify";
import { AuthorizeWhiteboardPermissionUseCase } from "../../application/modules/live-call/use-cases/authorize-whiteboard-permission.use-case";
import type { IAuthorizeWhiteboardPermissionUseCase } from "../../application/modules/live-call/use-cases/authorize-whiteboard-permission.use-case.interface";
import { JoinSessionUseCase } from "../../application/modules/live-call/use-cases/join-session.use-case";
import type { IJoinSessionUseCase } from "../../application/modules/live-call/use-cases/join-session.use-case.interface";
import { TerminateSessionUseCase } from "../../application/modules/live-call/use-cases/terminate-session.use-case";
import type { ITerminateSessionUseCase } from "../../application/modules/live-call/use-cases/terminate-session.use-case.interface";
import { ValidateJoinSessionUseCase } from "../../application/modules/live-call/use-cases/validate-join-session.use-case";
import type { IValidateJoinSessionUseCase } from "../../application/modules/live-call/use-cases/validate-join-session.use-case.interface";
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

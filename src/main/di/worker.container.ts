import { Container } from "inversify";
import {
	ChangePasswordOtpHandler,
	MentorApprovalHandler,
	NotificationWorkerFactory,
	RegisterOtpHandler,
	ResetPasswordOtpHandler,
	SessionReminderHandler,
} from "../../infrastructure/queue/workers";
import { TYPES } from "../../shared/types/types";
import { registerInfrastructureServiceBindings } from "./infrastructure-services.di";
import { registerQueueBindings } from "./queues.di";
import { registerRepositoryBindings } from "./repositories.di";

const workerContainer = new Container();

registerRepositoryBindings(workerContainer);
registerInfrastructureServiceBindings(workerContainer);
registerQueueBindings(workerContainer);
workerContainer
	.bind<NotificationWorkerFactory>(TYPES.Workers.NotificationWorkerFactory)
	.to(NotificationWorkerFactory)
	.inSingletonScope();
workerContainer
	.bind<RegisterOtpHandler>(TYPES.Workers.RegisterOtpHandler)
	.to(RegisterOtpHandler)
	.inSingletonScope();
workerContainer
	.bind<ResetPasswordOtpHandler>(TYPES.Workers.ResetPasswordOtpHandler)
	.to(ResetPasswordOtpHandler)
	.inSingletonScope();
workerContainer
	.bind<ChangePasswordOtpHandler>(TYPES.Workers.ChangePasswordOtpHandler)
	.to(ChangePasswordOtpHandler)
	.inSingletonScope();
workerContainer
	.bind<MentorApprovalHandler>(TYPES.Workers.MentorApprovalHandler)
	.to(MentorApprovalHandler)
	.inSingletonScope();
workerContainer
	.bind<SessionReminderHandler>(TYPES.Workers.SessionReminderHandler)
	.to(SessionReminderHandler)
	.inSingletonScope();

export { workerContainer };

import { Container } from "inversify";
import { MentorNoShowService } from "../../application/modules/booking/services/mentor-no-show.service";
import { MentorSessionPayoutService } from "../../application/modules/booking/services/mentor-session-payout.service";
import { SessionRefundService } from "../../application/modules/booking/services/session-refund.service";
import { SessionSettlementCalculatorService } from "../../application/modules/booking/services/session-settlement-calculator.service";
import { SettleEndedSessionUseCase } from "../../application/modules/booking/use-cases/settle-ended-session.use-case";
import type { ISettleEndedSessionUseCase } from "../../application/modules/booking/use-cases/settle-ended-session.use-case.interface";
import {
	BookingSettlementHandler,
	BookingWorkerFactory,
	ChangePasswordOtpHandler,
	MentorApprovalHandler,
	NotificationWorkerFactory,
	RegisterOtpHandler,
	ResetPasswordOtpHandler,
	SessionReminderHandler,
} from "../../infrastructure/queue/workers";
import { TYPES } from "../../shared/types/types";
import { registerInfrastructureServiceBindings } from "./infrastructure-services.di";
import { registerNotificationBindings } from "./notifications.di";
import { registerQueueBindings } from "./queues.di";
import { registerRepositoryBindings } from "./repositories.di";

const workerContainer = new Container();

registerRepositoryBindings(workerContainer);
registerInfrastructureServiceBindings(workerContainer);
registerQueueBindings(workerContainer);
registerNotificationBindings(workerContainer);
workerContainer
	.bind<NotificationWorkerFactory>(TYPES.Workers.NotificationWorkerFactory)
	.to(NotificationWorkerFactory)
	.inSingletonScope();
workerContainer
	.bind<BookingWorkerFactory>(TYPES.Workers.BookingWorkerFactory)
	.to(BookingWorkerFactory)
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
workerContainer
	.bind<BookingSettlementHandler>(TYPES.Workers.BookingSettlementHandler)
	.to(BookingSettlementHandler)
	.inSingletonScope();
workerContainer
	.bind<SessionSettlementCalculatorService>(
		TYPES.Services.SessionSettlementCalculator,
	)
	.to(SessionSettlementCalculatorService)
	.inSingletonScope();
workerContainer
	.bind<MentorSessionPayoutService>(TYPES.Services.MentorSessionPayout)
	.to(MentorSessionPayoutService)
	.inSingletonScope();
workerContainer
	.bind<SessionRefundService>(TYPES.Services.SessionRefund)
	.to(SessionRefundService)
	.inSingletonScope();
workerContainer
	.bind<MentorNoShowService>(TYPES.Services.MentorNoShow)
	.to(MentorNoShowService)
	.inSingletonScope();
workerContainer
	.bind<ISettleEndedSessionUseCase>(TYPES.UseCases.SettleEndedSession)
	.to(SettleEndedSessionUseCase)
	.inSingletonScope();

export { workerContainer };

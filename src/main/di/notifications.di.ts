import type { Container } from "inversify";
import {
	CreateNotificationUseCase,
	GetNotificationsUseCase,
	GetUnreadNotificationCountUseCase,
	MarkAllNotificationsReadUseCase,
	MarkNotificationReadUseCase,
	RegisterPushSubscriptionUseCase,
	UnregisterPushSubscriptionUseCase,
} from "../../application/modules/notification/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerNotificationBindings = (container: Container): void => {
	container
		.bind(TYPES.UseCases.CreateNotification)
		.to(CreateNotificationUseCase)
		.inSingletonScope();
	container
		.bind(TYPES.UseCases.GetNotifications)
		.to(GetNotificationsUseCase)
		.inSingletonScope();
	container
		.bind(TYPES.UseCases.MarkNotificationRead)
		.to(MarkNotificationReadUseCase)
		.inSingletonScope();
	container
		.bind(TYPES.UseCases.MarkAllNotificationsRead)
		.to(MarkAllNotificationsReadUseCase)
		.inSingletonScope();
	container
		.bind(TYPES.UseCases.GetUnreadNotificationCount)
		.to(GetUnreadNotificationCountUseCase)
		.inSingletonScope();
	container
		.bind(TYPES.UseCases.RegisterPushSubscription)
		.to(RegisterPushSubscriptionUseCase)
		.inSingletonScope();
	container
		.bind(TYPES.UseCases.UnregisterPushSubscription)
		.to(UnregisterPushSubscriptionUseCase)
		.inSingletonScope();
};

import type { Container } from "inversify";
import {
	CreateNotificationUseCase,
	GetNotificationsUseCase,
	GetUnreadNotificationCountUseCase,
	MarkAllNotificationsReadUseCase,
	MarkNotificationReadUseCase,
} from "../../application/modules/notifications/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerNotificationBindings = (container: Container): void => {
	container
		.bind(TYPES.UseCases.CreateNotification)
		.to(CreateNotificationUseCase);
	container.bind(TYPES.UseCases.GetNotifications).to(GetNotificationsUseCase);
	container
		.bind(TYPES.UseCases.MarkNotificationRead)
		.to(MarkNotificationReadUseCase);
	container
		.bind(TYPES.UseCases.MarkAllNotificationsRead)
		.to(MarkAllNotificationsReadUseCase);
	container
		.bind(TYPES.UseCases.GetUnreadNotificationCount)
		.to(GetUnreadNotificationCountUseCase);
};

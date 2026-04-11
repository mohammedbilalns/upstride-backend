import type { Container } from "inversify";
import { ArticleBlockedHandler } from "../../application/events/handlers/article/article-blocked.handler";
import { ArticleCommentCreatedHandler } from "../../application/events/handlers/article/article-comment-created.handler";
import { ArticleCommentReactionCreatedHandler } from "../../application/events/handlers/article/article-comment-reaction-created.handler";
import { ArticleReactionCreatedHandler } from "../../application/events/handlers/article/article-reaction-created.handler";
import { ArticleUnblockedHandler } from "../../application/events/handlers/article/article-unblocked.handler";
import { ArticleUserStatusChangedHandler } from "../../application/events/handlers/article/user-status-changed.handler";
import { SessionRefundedHandler } from "../../application/events/handlers/booking/session-refunded.handler";
import { MessageSentHandler } from "../../application/events/handlers/chat/message-sent.handler";
import { MentorUserStatusChangedHandler } from "../../application/events/handlers/mentor/user-status-changed.handler";
import { EmitMessageToUserHandler } from "../../application/events/handlers/notifications/emit-message-to-user.handler";
import { EmitNotificationToUserHandler } from "../../application/events/handlers/notifications/emit-notification-to-user.handler";
import type { CheckoutCompletedHandler } from "../../application/events/handlers/payment/checkout-completed.handler";
import type { CheckoutExpiredHandler } from "../../application/events/handlers/payment/checkout-expired.handler";
import type { CheckoutFailedHandler } from "../../application/events/handlers/payment/checkout-failed.handler";
import { ProfileUpdatedHandler } from "../../application/events/handlers/profile/profile-updated.handler";
import { UserRegisteredHandler } from "../../application/events/handlers/user-registered.handler";
import type { ICreateNotificationUseCase } from "../../application/modules/notifications/use-cases/create-notification.usecase.interface";
import type { PlatformSettingsService } from "../../application/services/platform-settings.service";
import type { IWalletService } from "../../application/services/wallet.service.interface";
import { TYPES } from "../../shared/types/types";
import { appEventBus } from "./queues.di";

export const bootstrapEventHandlers = (container: Container): void => {
	const walletService = container.get<IWalletService>(
		TYPES.Services.WalletService,
	);
	const platformSettings = container.get<PlatformSettingsService>(
		TYPES.Services.PlatformSettings,
	);

	const userRegisteredHandler = new UserRegisteredHandler(
		walletService,
		platformSettings,
	);

	const messageSentHandler = new MessageSentHandler(
		container.get<ICreateNotificationUseCase>(
			TYPES.UseCases.CreateNotification,
		),
	);
	const messageSentRealtimeHandler = new EmitMessageToUserHandler(
		container.get(TYPES.Services.NotificationPort),
	);
	const articleCommentCreatedHandler = new ArticleCommentCreatedHandler(
		container.get<ICreateNotificationUseCase>(
			TYPES.UseCases.CreateNotification,
		),
	);
	const articleReactionCreatedHandler = new ArticleReactionCreatedHandler(
		container.get<ICreateNotificationUseCase>(
			TYPES.UseCases.CreateNotification,
		),
	);
	const articleCommentReactionCreatedHandler =
		new ArticleCommentReactionCreatedHandler(
			container.get<ICreateNotificationUseCase>(
				TYPES.UseCases.CreateNotification,
			),
		);
	const profileUpdatedHandler = new ProfileUpdatedHandler(
		container.get(TYPES.Repositories.ArticleRepository),
	);
	const articleUserStatusChangedHandler = new ArticleUserStatusChangedHandler(
		container.get(TYPES.Repositories.ArticleRepository),
	);
	const mentorUserStatusChangedHandler = new MentorUserStatusChangedHandler(
		container.get(TYPES.Repositories.MentorWriteRepository),
	);
	const articleBlockedHandler = new ArticleBlockedHandler(
		container.get<ICreateNotificationUseCase>(
			TYPES.UseCases.CreateNotification,
		),
	);
	const articleUnblockedHandler = new ArticleUnblockedHandler(
		container.get<ICreateNotificationUseCase>(
			TYPES.UseCases.CreateNotification,
		),
	);
	const sessionRefundedHandler = new SessionRefundedHandler(
		container.get<ICreateNotificationUseCase>(
			TYPES.UseCases.CreateNotification,
		),
	);
	const notificationCreatedRealtimeHandler = new EmitNotificationToUserHandler(
		container.get(TYPES.Services.NotificationPort),
	);

	const checkoutCompletedHandler = container.get<CheckoutCompletedHandler>(
		TYPES.PaymentHandlers.CheckoutCompleted,
	);
	const checkoutExpiredHandler = container.get<CheckoutExpiredHandler>(
		TYPES.PaymentHandlers.CheckoutExpired,
	);
	const checkoutFailedHandler = container.get<CheckoutFailedHandler>(
		TYPES.PaymentHandlers.CheckoutFailed,
	);

	// Event Bus Registrations
	appEventBus.registerHandler(
		"user.registered",
		userRegisteredHandler.handle.bind(userRegisteredHandler),
	);
	appEventBus.registerHandler(
		"chat.message.sent",
		messageSentHandler.handle.bind(messageSentHandler),
	);
	appEventBus.registerHandler(
		"article.comment.created",
		articleCommentCreatedHandler.handle.bind(articleCommentCreatedHandler),
	);
	appEventBus.registerHandler(
		"article.reaction.created",
		articleReactionCreatedHandler.handle.bind(articleReactionCreatedHandler),
	);
	appEventBus.registerHandler(
		"article.comment.reaction.created",
		articleCommentReactionCreatedHandler.handle.bind(
			articleCommentReactionCreatedHandler,
		),
	);
	appEventBus.registerHandler(
		"profile.updated",
		profileUpdatedHandler.handle.bind(profileUpdatedHandler),
	);
	appEventBus.registerHandler(
		"user.status.changed",
		articleUserStatusChangedHandler.handle.bind(
			articleUserStatusChangedHandler,
		),
	);
	appEventBus.registerHandler(
		"user.status.changed",
		mentorUserStatusChangedHandler.handle.bind(mentorUserStatusChangedHandler),
	);
	appEventBus.registerHandler(
		"article.blocked",
		articleBlockedHandler.handle.bind(articleBlockedHandler),
	);
	appEventBus.registerHandler(
		"article.unblocked",
		articleUnblockedHandler.handle.bind(articleUnblockedHandler),
	);
	appEventBus.registerHandler(
		"session.refunded",
		sessionRefundedHandler.handle.bind(sessionRefundedHandler),
	);
	appEventBus.registerHandler(
		"checkout.completed",
		checkoutCompletedHandler.handle.bind(checkoutCompletedHandler),
	);
	appEventBus.registerHandler(
		"checkout.expired",
		checkoutExpiredHandler.handle.bind(checkoutExpiredHandler),
	);
	appEventBus.registerHandler(
		"checkout.failed",
		checkoutFailedHandler.handle.bind(checkoutFailedHandler),
	);

	appEventBus.registerHandler(
		"chat.message.sent",
		messageSentRealtimeHandler.handle.bind(messageSentRealtimeHandler),
	);
	appEventBus.registerHandler(
		"notification.created",
		notificationCreatedRealtimeHandler.handle.bind(
			notificationCreatedRealtimeHandler,
		),
	);
};

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
import { TYPES } from "../../shared/types/types";
import { appEventBus } from "./queues.di";

export const registerEventHandlersBindings = (container: Container): void => {
	container
		.bind(UserRegisteredHandler)
		.to(UserRegisteredHandler)
		.inSingletonScope();
	container.bind(MessageSentHandler).to(MessageSentHandler).inSingletonScope();
	container
		.bind(EmitMessageToUserHandler)
		.to(EmitMessageToUserHandler)
		.inSingletonScope();
	container
		.bind(ArticleCommentCreatedHandler)
		.to(ArticleCommentCreatedHandler)
		.inSingletonScope();
	container
		.bind(ArticleReactionCreatedHandler)
		.to(ArticleReactionCreatedHandler)
		.inSingletonScope();
	container
		.bind(ArticleCommentReactionCreatedHandler)
		.to(ArticleCommentReactionCreatedHandler)
		.inSingletonScope();
	container
		.bind(ProfileUpdatedHandler)
		.to(ProfileUpdatedHandler)
		.inSingletonScope();
	container
		.bind(ArticleUserStatusChangedHandler)
		.to(ArticleUserStatusChangedHandler)
		.inSingletonScope();
	container
		.bind(MentorUserStatusChangedHandler)
		.to(MentorUserStatusChangedHandler)
		.inSingletonScope();
	container
		.bind(ArticleBlockedHandler)
		.to(ArticleBlockedHandler)
		.inSingletonScope();
	container
		.bind(ArticleUnblockedHandler)
		.to(ArticleUnblockedHandler)
		.inSingletonScope();
	container
		.bind(SessionRefundedHandler)
		.to(SessionRefundedHandler)
		.inSingletonScope();
	container
		.bind(EmitNotificationToUserHandler)
		.to(EmitNotificationToUserHandler)
		.inSingletonScope();
};

export const bootstrapEventHandlers = (container: Container): void => {
	const userRegisteredHandler = container.get(UserRegisteredHandler);
	const messageSentHandler = container.get(MessageSentHandler);
	const messageSentRealtimeHandler = container.get(EmitMessageToUserHandler);
	const articleCommentCreatedHandler = container.get(
		ArticleCommentCreatedHandler,
	);
	const articleReactionCreatedHandler = container.get(
		ArticleReactionCreatedHandler,
	);
	const articleCommentReactionCreatedHandler = container.get(
		ArticleCommentReactionCreatedHandler,
	);
	const profileUpdatedHandler = container.get(ProfileUpdatedHandler);
	const articleUserStatusChangedHandler = container.get(
		ArticleUserStatusChangedHandler,
	);
	const mentorUserStatusChangedHandler = container.get(
		MentorUserStatusChangedHandler,
	);
	const articleBlockedHandler = container.get(ArticleBlockedHandler);
	const articleUnblockedHandler = container.get(ArticleUnblockedHandler);
	const sessionRefundedHandler = container.get(SessionRefundedHandler);
	const notificationCreatedRealtimeHandler = container.get(
		EmitNotificationToUserHandler,
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

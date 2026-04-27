import type { Container } from "inversify";
import type {
	IIdGenerator,
	IMailService,
	IPasswordService,
	IPaymentService,
	IPaymentWebhookParser,
	IStorageService,
	IWalletService,
	IWhiteboardCache,
	IPushNotificationPort as PushNotificationPort,
} from "../../application/services";
import { LRUFeedCacheService } from "../../infrastructure/cache/lru-feed-cache.service";
import { redisClient } from "../../infrastructure/database/redis/redis.connection";
import { RedisWhiteboardCache } from "../../infrastructure/database/redis/redis-whiteboard.cache";
import { WebPushAdapter } from "../../infrastructure/notifications/web-push.adapter";
import {
	Argon2PasswordService,
	CryptoOtpGenerator,
	GoogleOAuthService,
	JwtTokenService,
	LinkedInOAuthService,
	MailService,
	S3StorageService,
	StripePaymentService,
	StripeWebhookParser,
	UuidGenerator,
	WalletService,
} from "../../infrastructure/services";
import { TYPES } from "../../shared/types/types";

export const registerInfrastructureServiceBindings = (
	container: Container,
): void => {
	container
		.bind<IPasswordService>(TYPES.Services.Password)
		.to(Argon2PasswordService);
	container.bind(TYPES.Services.TokenService).to(JwtTokenService);
	container.bind<IMailService>(TYPES.Services.MailService).to(MailService);
	container.bind(TYPES.Services.OtpGenerator).to(CryptoOtpGenerator);
	container.bind(TYPES.Services.GoogleOAuth).to(GoogleOAuthService);
	container.bind(TYPES.Services.LinkedInOAuth).to(LinkedInOAuthService);
	container.bind<IStorageService>(TYPES.Services.Storage).to(S3StorageService);
	container
		.bind<IWhiteboardCache>(TYPES.Caches.Whiteboard)
		.to(RedisWhiteboardCache)
		.inSingletonScope();
	container
		.bind<IWalletService>(TYPES.Services.WalletService)
		.to(WalletService)
		.inSingletonScope();
	container
		.bind<IPaymentService>(TYPES.Services.PaymentService)
		.to(StripePaymentService)
		.inSingletonScope();
	container
		.bind<IPaymentWebhookParser>(TYPES.Services.PaymentWebhookParser)
		.to(StripeWebhookParser)
		.inSingletonScope();
	container
		.bind<IIdGenerator>(TYPES.Services.IdGenerator)
		.to(UuidGenerator)
		.inSingletonScope();

	container
		.bind<PushNotificationPort>(TYPES.Services.PushNotificationPort)
		.to(WebPushAdapter)
		.inSingletonScope();

	container.bind(TYPES.Databases.Redis).toConstantValue(redisClient);

	container
		.bind(TYPES.Services.FeedCacheService)
		.to(LRUFeedCacheService)
		.inSingletonScope();
};

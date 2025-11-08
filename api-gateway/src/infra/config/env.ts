import { configDotenv } from "dotenv";
import { z } from "zod";

configDotenv();

const envSchema = z.object({
	JWT_SECRET: z.string().min(1),
	PORT: z.string(),
	NODE_ENV: z.string(),
	CLIENT_URL: z.string(),
	IDENTITY_SERVICE_URL: z.string(),
	ARTICLE_SERVICE_URL: z.string(),
	GATEWAY_URL: z.string(),
	CHAT_SERVICE_URL: z.string(),
	MEDIA_SERVICE_URL: z.string(),
	NOTIFICATION_SERVICE_URL: z.string(),
	SESSIONS_SERVICE_URL: z.string(),
	RABBITMQ_URL: z.string(),
	REDIS_URL: z.string(),
	EXCHANGE_NAME: z.string(),
});

const env = envSchema.parse(process.env);
export default env;

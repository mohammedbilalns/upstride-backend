import { z } from "zod";

const envSchema = z.object({
	JWT_SECRET: z.string().min(1),
	PORT: z.string(),
	NODE_ENV: z.string(),
	MONGODB_URI: z.string(),
	RABBITMQ_URL: z.string(),
	EXCHANGE_NAME: z.string(),
	ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
	REFRESH_TOKEN_EXPIRY: z.string().default("7d"),
	REDIS_URL: z.string(),
	USERS_ENDPOINT: z.string().default("http://localhost:3000/api/v1/users"),
	PAYMENT_SERVICE_URL: z
		.string()
		.default("http://localhost:3002/api/v1/payments"),
});

const env = envSchema.parse(process.env);
export default env;

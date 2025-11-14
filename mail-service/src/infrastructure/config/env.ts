import { z } from "zod";

const envSchema = z.object({
	JWT_SECRET: z.string().min(1),
	NODE_ENV: z.string(),
	MONGODB_URI: z.string(),
	RABBITMQ_URL: z.string(),
	EXCHANGE_NAME: z.string(),
	ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
	REFRESH_TOKEN_EXPIRY: z.string().default("7d"),
	EMAIL_USER: z.string().min(1),
	EMAIL_PASS: z.string().min(1),
});

const env = envSchema.parse(process.env);
export default env;

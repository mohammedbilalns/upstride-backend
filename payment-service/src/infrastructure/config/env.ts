import z from "zod";

const envSchema = z.object({
	JWT_SECRET: z.string().min(1),
	PORT: z.string().min(1),
	NODE_ENV: z.string(),
	MONGODB_URI: z.string(),
	RABBITMQ_URL: z.string(),
	EXCHANGE_NAME: z.string(),
	ACCESS_TOKEN_EXPIRY: z.string(),
	REFRESH_TOKEN_EXPIRY: z.string(),
	REDIS_URL: z.string(),
	GATEWAY_URL: z.string(),
	CLIENT_URL: z.string(),
});

const env = envSchema.parse(process.env);
export default env;

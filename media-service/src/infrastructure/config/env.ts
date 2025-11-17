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
	CLOUDINARY_API_SECRET: z.string(),
	CLOUDINARY_CLOUD_NAME: z.string(),
	CLOUDINARY_API_KEY: z.string(),
	CLOUDINARY_UPLOAD_PRESET: z.string(),
});

const env = envSchema.parse(process.env);
export default env;

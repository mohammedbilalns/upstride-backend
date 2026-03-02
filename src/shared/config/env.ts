import z from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().min(1).default(3000),
	MONGODB_URI: z.string().min(1),
	REDIS_URI: z.string().min(1),
	APP_URL: z.string().min(1),
	CLIENT_URL: z.string().min(1),
	NODE_ENV: z.enum(["development", "production", "test"]),
	LOKI_HOST: z.string().min(1),
	JWT_ACCESS_SECRET: z.string().min(1).default("secret"),
	JWT_REFRESH_SECRET: z.string().min(1).default("secret2"),
});

const env = envSchema.parse(process.env);
export default env;

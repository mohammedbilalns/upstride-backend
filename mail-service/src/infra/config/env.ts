import { configDotenv } from "dotenv";
import { z } from "zod";
configDotenv();

const envSchema = z.object({
  JWT_SECRET: z.string().min(1),
  PORT: z.string(),
  NODE_ENV: z.string(),
  MONGODB_URI: z.string(),
});

const env = envSchema.parse(process.env);
export default env;
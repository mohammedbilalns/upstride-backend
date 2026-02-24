import z from "zod"

const envSchema = z.object({
  PORT: z.coerce.number().min(1).default(3000),
  MONGODB_URI: z.string().min(1),
  REDIS_URI: z.string().min(1),
})

const env = envSchema.parse(process.env)
export default env

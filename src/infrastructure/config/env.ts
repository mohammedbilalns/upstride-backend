import z from "zod"

const envSchema = z.object({
  PORT: z.string().min(1),
  MONGODB_URI: z.string().min(1),
}
)

const env = envSchema.safeParse(process.env)
export default env

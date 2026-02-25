import { CorsOptions } from "cors";
import env from "@/infrastructure/config/env.js";

export const corsOptions: CorsOptions = {
	origin: env.CLIENT_URL,
	credentials: true,
};

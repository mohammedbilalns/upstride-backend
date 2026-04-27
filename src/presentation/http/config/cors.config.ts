import type { CorsOptions } from "cors";
import env from "../../../shared/config/env";

export const corsOptions: CorsOptions = {
	origin: env.CLIENT_URL,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	credentials: true,
};

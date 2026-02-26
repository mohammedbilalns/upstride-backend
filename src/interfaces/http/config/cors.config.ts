import type { CorsOptions } from "cors";
import env from "../../../shared/config/env";

export const corsOptions: CorsOptions = {
	origin: env.CLIENT_URL,
	credentials: true,
};

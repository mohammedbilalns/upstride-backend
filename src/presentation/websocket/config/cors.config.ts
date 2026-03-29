import env from "../../../shared/config/env";

export const socketIOCorsOptions = {
	origin: env.CLIENT_URL,
	methods: ["GET", "POST"],
};

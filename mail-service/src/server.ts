import { configDotenv } from "dotenv";
import logger from "./common/utils/logger";
import { connectRabbitMq } from "./infrastructure/events/connectRabbitMq";

configDotenv();

async function bootstrap() {
	try {
		await connectRabbitMq();
		logger.info("Mail service connected to RabbitMQ and ready");
	} catch (err) {
		logger.error("Failed to start mail service:", err);
		process.exit(1);
	}
}

bootstrap();

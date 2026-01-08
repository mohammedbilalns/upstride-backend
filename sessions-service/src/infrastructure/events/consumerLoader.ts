import logger from "../../common/utils/logger";

import { composePaymentVerifiedConsumer } from "./compositions/paymentVerified.composition";

export async function loadConsumers() {
	await composePaymentVerifiedConsumer();
	logger.info("Event consumers loaded");
}

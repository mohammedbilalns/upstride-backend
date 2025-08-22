import logger from "../../common/utils/logger";
import { composeSendOtpConsumer } from "./compostisitions/sendOtp.composition";

export async function loadConsumers() {
  await composeSendOtpConsumer();
  logger.info("Event consumers loaded");
}

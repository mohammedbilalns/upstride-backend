import logger from "../../common/utils/logger";
import { composeUpdateUserData } from "./compositions/update-user-data.composition";

export async function loadConsumers() {
	await composeUpdateUserData();
	logger.info("Event consumers loaded");
}

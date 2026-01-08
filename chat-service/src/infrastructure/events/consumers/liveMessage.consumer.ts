import logger from "../../../common/utils/logger";

export const liveMessageConsumer = async (data: any) => {
	try {
		logger.info(
			`[ChatService] Received live session message: ${JSON.stringify(data)}`,
		);
	} catch (error: any) {
		logger.error(`Error processing live message: ${error.message}`);
	}
};

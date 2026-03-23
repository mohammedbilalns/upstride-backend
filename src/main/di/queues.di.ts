import { Queue } from "bullmq";
import type { Container } from "inversify";
import { redisClient } from "../../infrastructure/database/redis/redis.connection";
import { TYPES } from "../../shared/types/types";

export const mailQueue = new Queue("mailQueue", { connection: redisClient });

export const registerQueueBindings = (container: Container): void => {
	container.bind<Queue>(TYPES.Queues.MailQueue).toConstantValue(mailQueue);
};

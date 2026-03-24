import type {
	CreateNotificationInput,
	CreateNotificationOutput,
} from "../dtos/notification.dto";

export interface ICreateNotificationUseCase {
	execute(input: CreateNotificationInput): Promise<CreateNotificationOutput>;
}

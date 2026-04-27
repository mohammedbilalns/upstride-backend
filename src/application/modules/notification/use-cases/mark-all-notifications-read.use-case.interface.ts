import type {
	MarkAllNotificationsReadInput,
	MarkAllNotificationsReadOutput,
} from "../dtos/notification.dto";

export interface IMarkAllNotificationsReadUseCase {
	execute(
		input: MarkAllNotificationsReadInput,
	): Promise<MarkAllNotificationsReadOutput>;
}

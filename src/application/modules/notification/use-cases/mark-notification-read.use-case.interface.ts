import type {
	MarkNotificationReadInput,
	MarkNotificationReadOutput,
} from "../dtos/notification.dto";

export interface IMarkNotificationReadUseCase {
	execute(
		input: MarkNotificationReadInput,
	): Promise<MarkNotificationReadOutput>;
}

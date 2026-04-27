import type { ScheduleLiveSesionReminderInput } from "../dtos/schedule-live-sesion-reminder.dto";

export interface IScheduleLiveSesionReminderUseCase {
	execute(input: ScheduleLiveSesionReminderInput): Promise<void>;
}

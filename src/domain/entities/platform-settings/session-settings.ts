import { EntityValidationError } from "../../errors/entity-validation.error";

export class SessionSettings {
	public readonly cancellationWindowHours: number;

	public readonly rescheduleWindowHours: number;

	public readonly maxSessionsPerDayPerMentor: number;

	constructor(
		cancellationWindowHours: number,
		rescheduleWindowHours: number,
		maxSessionsPerDayPerMentor: number,
	) {
		if (cancellationWindowHours < rescheduleWindowHours) {
			throw new EntityValidationError(
				"SessionSettings",
				"cancellation window cannot be less than reschedule window",
			);
		}

		this.cancellationWindowHours = cancellationWindowHours;
		this.rescheduleWindowHours = rescheduleWindowHours;
		this.maxSessionsPerDayPerMentor = maxSessionsPerDayPerMentor;
		Object.freeze(this);
	}
}

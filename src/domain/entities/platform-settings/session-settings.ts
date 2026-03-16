import { EntityValidationError } from "../../errors/entity-validation.error";

export class SessionSettings {
	public readonly cancellationWindowHours: number;

	public readonly rescheduleWindowHours: number;

	public readonly maxSessionsPerDayPerMentor: number;

	public readonly platformFeePercentage: number;

	constructor(
		cancellationWindowHours: number,
		rescheduleWindowHours: number,
		maxSessionsPerDayPerMentor: number,
		platformFeePercentage: number,
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
		this.platformFeePercentage = platformFeePercentage;
		Object.freeze(this);
	}
}

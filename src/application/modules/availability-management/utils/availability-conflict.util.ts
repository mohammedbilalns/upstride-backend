import type { Availability } from "../../../../domain/entities/availability.entity";
import { toMinutes } from "../../../../shared/utilities/time.util";

type AvailabilityLike = Pick<
	Availability,
	"days" | "startTime" | "endTime" | "startDate" | "endDate"
>;

export const isAvailabilityConflict = (
	candidate: AvailabilityLike,
	existing: Availability,
): boolean => {
	const candidateStartDate = new Date(`${candidate.startDate}T00:00:00.000Z`);
	const candidateEndDate = new Date(`${candidate.endDate}T00:00:00.000Z`);
	const existingStartDate = new Date(`${existing.startDate}T00:00:00.000Z`);
	const existingEndDate = new Date(`${existing.endDate}T00:00:00.000Z`);

	const dateOverlap =
		candidateStartDate <= existingEndDate &&
		candidateEndDate >= existingStartDate;

	if (!dateOverlap) return false;

	const dayOverlap = Array.from(candidate.days).some((day) =>
		existing.days.has(day),
	);

	if (!dayOverlap) return false;

	const candidateStartMin = toMinutes(candidate.startTime);
	const candidateEndMin = toMinutes(candidate.endTime);
	const existingStartMin = toMinutes(existing.startTime);
	const existingEndMin = toMinutes(existing.endTime);

	return (
		candidateStartMin < existingEndMin && candidateEndMin > existingStartMin
	);
};

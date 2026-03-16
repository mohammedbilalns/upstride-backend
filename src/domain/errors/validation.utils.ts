import { EntityValidationError } from "./entity-validation.error";

export interface PositiveField {
	label: string;
	value: number;
}

export const ensureGreaterThanZero = (
	entity: string,
	fields: PositiveField[],
) => {
	const invalidLabels = fields
		.filter((field) => field.value <= 0)
		.map((field) => field.label);

	if (invalidLabels.length === 0) return;

	const message =
		invalidLabels.length === 1
			? `${invalidLabels[0]} must be greater than 0`
			: `${invalidLabels.join(" and ")} must be greater than 0`;

	throw new EntityValidationError(entity, message);
};

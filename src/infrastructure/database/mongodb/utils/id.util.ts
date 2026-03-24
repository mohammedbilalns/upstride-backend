export const toIdString = (value: unknown): string => {
	if (!value) return "";
	if (typeof value === "string") return value;
	const withId = value as { _id?: { toString?: () => string } };
	if (withId._id?.toString) return withId._id.toString();
	const withToString = value as { toString?: () => string };
	return withToString.toString?.() ?? "";
};

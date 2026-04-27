/**
 * Formats device information into a human-readable string.
 */
export const formatDeviceString = (
	browser?: string,
	vendor?: string,
	model?: string,
	os?: string,
): string => {
	const parts = [vendor, model, os].filter(
		(part) => part && part.toLowerCase() !== "unknown",
	);
	const deviceDetails = parts.join(" ").trim();
	const browserName =
		browser && browser.toLowerCase() !== "unknown"
			? browser
			: "Unknown Browser";

	return deviceDetails
		? `${browserName} on ${deviceDetails}`
		: `${browserName} on unknown device`;
};

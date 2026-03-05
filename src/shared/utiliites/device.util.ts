export const formatDeviceString = (
	browser?: string,
	vendor?: string,
	model?: string,
	os?: string,
): string => {
	const deviceDetails = `${vendor || ""} ${model || ""} ${os || ""}`.trim();
	const formattedString = `${browser || "unknown"} on ${
		deviceDetails || "unknown device"
	}`;
	return formattedString;
};

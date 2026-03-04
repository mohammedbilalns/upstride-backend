export const formatDeviceString = (
	vendor?: string,
	model?: string,
	os?: string,
): string => {
	const formattedString = `${vendor || ""} ${model || ""} ${os || ""}`.trim();
	return formattedString || "unknown";
};

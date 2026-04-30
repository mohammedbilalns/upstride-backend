export function toTitleCase(input: string): string {
	return input
		.trim()
		.toLowerCase()
		.replace(/\s+/g, " ")
		.replace(/\b\p{L}/gu, (char) => char.toUpperCase());
}

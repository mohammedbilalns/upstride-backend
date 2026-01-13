export function generateDescription(content: string): string {
	if (!content) return "";

	const plainText = content
		.replace(/<[^>]*>/g, "")
		.replace(/\s+/g, " ")
		.trim();

	if (plainText.length <= 150) {
		return plainText;
	}
	const truncated = plainText.substring(0, 150);
	const lastSpaceIndex = truncated.lastIndexOf(" ");

	if (lastSpaceIndex > 0) {
		return `${truncated.substring(0, lastSpaceIndex)}...`;
	}

	return `${truncated.substring(0, 147)}...`;
}

const DEFAULT_PREVIEW_LENGTH = 120;

export const generatePreviewContent = (
	content: string,
	maxLength = DEFAULT_PREVIEW_LENGTH,
): string => {
	const trimmed = content.trim().replace(/\s+/g, " ");
	if (trimmed.length <= maxLength) {
		return trimmed;
	}

	const safeLength = Math.max(0, maxLength - 3);
	return `${trimmed.slice(0, safeLength).trimEnd()}...`;
};

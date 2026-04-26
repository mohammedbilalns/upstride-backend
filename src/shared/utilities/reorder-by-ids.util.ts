export function reorderByIds<T extends { id: string }>(
	items: T[],
	orderedIds: string[],
): T[] {
	const map = new Map<string, T>();

	for (const item of items) {
		map.set(item.id, item);
	}

	const result: T[] = [];

	for (const id of orderedIds) {
		const item = map.get(id);
		if (item) result.push(item);
	}

	return result;
}

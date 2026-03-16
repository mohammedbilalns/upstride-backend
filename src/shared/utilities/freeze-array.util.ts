/**
 * Creates a frozen copy of an array to prevent accidental mutations.
 */
export const freezeArray = <T>(items: readonly T[]): readonly T[] =>
	Object.freeze([...items]);

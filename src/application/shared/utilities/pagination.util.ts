import type { PaginatedResult } from "../../../domain/repositories/capabilities";

/**
 * Creates an empty paginated result with zero items and total.
 */
export const emptyPaginatedResult = <T>(
	page: number,
	limit: number,
): PaginatedResult<T> => ({
	items: [],
	total: 0,
	page,
	limit,
	totalPages: 0,
});

/**
 * Transforms the items within a paginated result using the provided mapping function.
 */
export const mapPaginatedResult = <T, U>(
	result: PaginatedResult<T>,
	mapItems: (items: T[]) => U[],
) => ({
	items: mapItems(result.items),
	total: result.total,
	page: result.page,
	limit: result.limit,
	totalPages: result.totalPages,
});

/**
 * Builds pagination metadata including the calculated totalPages.
 */
export const buildPaginationMeta = (
	page: number,
	limit: number,
	totalCount: number,
	minTotalPages: number = 0,
) => ({
	page,
	limit,
	totalCount,
	totalPages: Math.max(minTotalPages, Math.ceil(totalCount / limit)),
});

export interface PaginateParams<Q = unknown> {
	page: number;
	limit: number;
	query?: Q;
	sort?: Record<string, 1 | -1>;
}
export interface PaginatedResult<T> {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface PaginatableRepository<T, Q = unknown> {
	paginate(params: PaginateParams<Q>): Promise<PaginatedResult<T>>;
}

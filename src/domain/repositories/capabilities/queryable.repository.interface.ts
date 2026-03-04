export interface QueryParams<Q = unknown> {
	query?: Q;
	sort?: Record<string, 1 | -1>;
}

export interface QueryableRepository<T, Q = unknown> {
	query(params: QueryParams<Q>): Promise<T[]>;
}

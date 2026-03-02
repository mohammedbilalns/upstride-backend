export interface CreatableRepository<T> {
	create(entity: T): Promise<T>;
}

export interface UpdatableByIdRepository<T, Id = string> {
	updateById(id: Id, update: Partial<T>): Promise<T | null>;
}

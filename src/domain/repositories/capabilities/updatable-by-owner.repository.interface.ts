export interface UpdatableByOwnerRepository<T, OwnerId = string> {
	updateByOwnerId(ownerId: OwnerId, update: Partial<T>): Promise<T | null>;
}

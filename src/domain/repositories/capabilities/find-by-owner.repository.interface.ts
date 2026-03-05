export interface FindByOwnerRepository<T, OwnerId = string> {
	findByOwnerId(ownerId: OwnerId): Promise<T | null>;
}

export interface EnableableRepository {
	enable(id: string): Promise<void>;
}

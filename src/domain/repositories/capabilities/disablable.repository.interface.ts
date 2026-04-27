export interface DisablableRepository {
	disable(id: string): Promise<void>;
}

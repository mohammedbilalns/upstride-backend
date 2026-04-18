export interface IIdGenerator {
	generate(): string;
	generateMany(count: number): string[];
}

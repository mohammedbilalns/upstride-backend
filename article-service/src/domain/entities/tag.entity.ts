export interface Tag {
	id: string;
	name: string;
	promoted: boolean;
	usageCount: number;
	createdAt: Date;
}

export type PopulatedTag = Tag & { _id?: string };

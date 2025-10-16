export interface Tag {
	id: string;
	name: string;
	promoted: boolean;
	usageCount: number;
	createdAt: Date;
}

export interface PopulatedTag {
	_id: string;
	name: string;
	promoted: boolean;
	usageCount: number;
	createdAt: Date;
}

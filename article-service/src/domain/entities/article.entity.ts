export interface Article {
	id: string;
	authorName: string;
	authorImage?: string;
	featuredImage?: string;
	title: string;
	author: string;
	tags: string[];
	description: string;
	isActive: boolean;
	views: number;
	comments: number;
	likes: number;
	isArchived: boolean;
	content: string;
}

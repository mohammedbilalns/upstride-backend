export interface ArticleTopTagDto {
	tag: string;
	count: number;
}

export interface GetArticleTopTagsOutput {
	tags: ArticleTopTagDto[];
}

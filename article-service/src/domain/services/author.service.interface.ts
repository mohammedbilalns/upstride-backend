export interface IAuthorService {
	updateAuthor(
		authorId: string,
		authorName: string,
		authorImage: string,
	): Promise<void>;
}

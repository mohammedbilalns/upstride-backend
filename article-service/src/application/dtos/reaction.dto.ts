export interface ReactionDto {
	resourceId: string;
	resourceType: "article" | "comment";
	userId: string;
	userName: string;  
	reaction: "like" | "dislike";
}


export interface ReactableResource {
  id: string;
  likes?: number;
}

export interface Article extends ReactableResource {
  author: string;
  title: string;
}

export interface ArticleComment extends ReactableResource {
  userId: string;
  articleId?: Article | string;
}

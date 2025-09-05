import { Document,model,Schema } from "mongoose";
import { ArticleView } from "../../../domain/entities/articleView.entity";

export interface IArticleView  extends Document, Omit<ArticleView, "id"> {
}

export const ArticleViewSchema:Schema = new Schema({
	articleId: {type:Schema.Types.ObjectId, ref: "Article"},
	userId: {type:String, required:true},
	createdAt: {type: Date, required: true},
},
	{
		timestamps: true,
	});


export const ArticleViewModel = model<IArticleView>("ArticleView", ArticleViewSchema);

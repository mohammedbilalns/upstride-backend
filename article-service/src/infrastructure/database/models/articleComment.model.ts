import { Document,model,Schema } from "mongoose";
import { ArticleComment } from "../../../domain/entities/articleComment.entity";

export interface IArticleComment  extends Document, Omit<ArticleComment, "id"> {
}

export const ArticleCommentSchema:Schema = new Schema({
	articleId: {type:Schema.Types.ObjectId, ref: "Article"},
	parentId: {type:Schema.Types.ObjectId, ref: "ArticleComment"},
	userId: {type:String, required:true},
	userName: {type:String, required:true},
	userImage: {type:String, required:true},
	content: {type: String, required: true},	
	isActive: {type: Boolean, default: true},
},		
	{
		timestamps: true,
	});	

export const ArticleCommentModel = model<IArticleComment>("ArticleComment", ArticleCommentSchema);

import { Document,model,Schema } from "mongoose";
import { Article } from "../../../domain/entities/article.entity";

export interface IArticle  extends Document, Omit<Article, "id"> {}

export const ArticleSchema:Schema = new Schema<IArticle>({
	authorName: {type: String, required: true},
	authorImage: {type: String},
	featuredImage: {type: String, required: false},
	title: {type: String, required: true},
	description: {type: String, required: true},
	category: {type: String, required: true},
	topics: {type: [String], required: true},
	author: {type: String, required: true},
	tags: [{type:Schema.Types.ObjectId, ref: "Tag"}],
	isActive: {type: Boolean, required: true},
	views: {type: Number, required: true},
	comments: {type: Number, required: true},
	likes: {type: Number, required: true},
	isArchived: {type: Boolean, required: true},
	content: {type: String, required: true},
},{
		timestamps: true,
	});


export const ArticleModel = model<IArticle>("Article", ArticleSchema);

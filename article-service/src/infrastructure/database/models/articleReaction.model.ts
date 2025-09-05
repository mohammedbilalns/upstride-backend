import { Document,model,Schema} from "mongoose";
import { ArticleReaction } from "../../../domain/entities/articleReaction.entity";

export interface IArticleReaction  extends Document, Omit<ArticleReaction, "id"> {
}

export const ArticleReactionSchema:Schema = new Schema({
	articleId: {type:Schema.Types.ObjectId, ref: "Article"},
	userId: {type:String, required:true},
	reaction: {type: String, required: true},
	createdAt: {type: Date, required: true},
},
	{
		timestamps: true,
	});


export const ArticleReactionModel = model<IArticleReaction>("ArticleReaction", ArticleReactionSchema);

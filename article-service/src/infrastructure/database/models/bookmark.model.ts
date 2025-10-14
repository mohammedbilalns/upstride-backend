import { type Document, model, Schema } from "mongoose";
import type { BookMark } from "../../../domain/entities/bookmark.entity";

export interface IBookMark extends Document, Omit<BookMark, "id"> {}

export const bookMarkSchema: Schema = new Schema(
	{
		userId: { type: String, required: true },
		articleId: { type: Schema.Types.ObjectId, ref: "Article", required: true },
	},
	{
		timestamps: true,
	},
);


export const BookMarkModel = model<IBookMark>(
	"SavedArticle",
	bookMarkSchema,
);

import { Document,model,Schema } from "mongoose";
import { Tag } from "../../../domain/entities/tag.entity";

export interface ITag  extends Document, Omit<Tag, "id"> {}

export const TagSchema:Schema = new Schema({
	name: {type: String, required: true},
	promoted: {type: Boolean, default: false},
	usageCount: {type: Number, default:0},
	createdAt: {type: Date, required: true},
},
	{
		timestamps: true,
	});


export const TagModel = model<ITag>("Tag", TagSchema);

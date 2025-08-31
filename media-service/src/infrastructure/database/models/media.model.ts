import { Document, model, Schema } from "mongoose";
import { Media } from "../../../domain/entities/media.entity";

export interface IMedia extends Document, Omit<Media, "id"> {}

export const mediaSchema = new Schema({
	mediaType:{type:String,enum:["image","audio","document"], default:"image"},
	category:{type:String,enum:["profile", "article","chat", "resume"]},
	publicId:{type:String,required:true},
	originalName:{type:String,required:true},
	url:{type:String,required:true},
	size:{type:Number,required:true},
	articleId:{type:String},
	chatMessageId:{type:String},
	mentorId:{type:String},
	userId:{type:String,required:true}
},{ timestamps: true });

mediaSchema.index({userId:1,publicId:1});
export const meidaModel = model<IMedia>("Media");

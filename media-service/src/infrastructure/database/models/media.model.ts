import { Document, model, Schema } from "mongoose";
import { Media } from "../../../domain/entities/media.entity";

export interface IMedia extends Document, Omit<Media, "id"> {}

export const mediaSchema = new Schema({
	mediaType:{type:String,enum:["image","audio","document"], default:"image"},
	publicId:{type:String,required:true},
	originalName:{type:String,required:true},
	url:{type:String,required:true},
	userId:{type:String,required:true}
},{ timestamps: true });

mediaSchema.index({userId:1,publicId:1});
export const meidaModel = model<IMedia>("Media");

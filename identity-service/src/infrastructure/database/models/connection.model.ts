import { type Document, model, Schema } from "mongoose";
import type { Connection } from "../../../domain/entities/connection.entity";

export interface IConnection extends Document, Omit<Connection, "id"> {}

export const connectionSchema: Schema = new Schema({
	mentorId: { type: Schema.Types.ObjectId, ref: "Mentor" },
	followerId: { type: Schema.Types.ObjectId, ref: "User" },
});

connectionSchema.index({ mentorId: 1, followerId: 1 }, { unique: true });

export const ConnectionModel = model<IConnection>(
	"Connection",
	connectionSchema,
);

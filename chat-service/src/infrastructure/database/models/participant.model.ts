import { Document, model, Schema } from "mongoose";
import { Participant } from "../../../domain/entities/participant.entity";

export interface IParticipant extends Document, Omit<Participant, "id"> {}

export const participantSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
		userId: { type: String, required: true },
		role: { type: String, enum: ["MEMBER", "ADMIN"], default: "MEMBER" },
		jointedAt: { type: Date },
		lastReadAt: { type: Date },
		isMuted: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	},
);

export const ParticipantModel = model<IParticipant>(
	"Participant",
	participantSchema,
);

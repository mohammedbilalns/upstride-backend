import { model, Schema, type Types } from "mongoose";
import {
	type ReportStatus,
	ReportStatusValues,
	type ReportTargetType,
	ReportTargetTypeValues,
} from "../../../../domain/entities/report.entity";

export interface ReportDocument {
	_id: Types.ObjectId;
	reporterId: Types.ObjectId;
	targetId: Types.ObjectId;
	targetType: ReportTargetType;
	reason: string;
	description: string;
	status: ReportStatus;
	actionTaken: string;
	createdAt: Date;
	updatedAt: Date;
}

const reportSchema = new Schema<ReportDocument>(
	{
		reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		targetId: { type: Schema.Types.ObjectId, required: true },
		targetType: { type: String, enum: ReportTargetTypeValues, required: true },
		reason: { type: String, required: true },
		description: { type: String, required: true },
		status: {
			type: String,
			enum: ReportStatusValues,
			required: true,
			default: "PENDING",
		},
		actionTaken: { type: String, default: "" },
	},
	{ timestamps: true },
);

reportSchema.index({ reporterId: 1, createdAt: -1 });
reportSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });
reportSchema.index({ status: 1, createdAt: -1 });

export const ReportModel = model<ReportDocument>("Report", reportSchema);

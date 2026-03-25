export const ReportTargetTypeValues = ["USER", "ARTICLE"] as const;
export type ReportTargetType = (typeof ReportTargetTypeValues)[number];

export const ReportStatusValues = [
	"PENDING",
	"RESOLVED",
	"REJECTED",
	"CLOSED",
] as const;
export type ReportStatus = (typeof ReportStatusValues)[number];

export class Report {
	constructor(
		public readonly id: string,
		public readonly reporterId: string,
		public readonly targetId: string,
		public readonly targetType: ReportTargetType,
		public readonly reason: string,
		public readonly description: string,
		public readonly status: ReportStatus,
		public readonly actionTaken: string,
		public readonly createdAt: Date | null,
		public readonly updatedAt: Date | null,
	) {}
}

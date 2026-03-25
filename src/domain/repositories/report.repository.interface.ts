import type {
	Report,
	ReportStatus,
	ReportTargetType,
} from "../entities/report.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	PaginatableRepository,
	QueryableRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface ReportQuery {
	reporterId?: string;
	targetId?: string;
	targetType?: ReportTargetType | ReportTargetType[];
	status?: ReportStatus | ReportStatus[];
}

export interface IReportRepository
	extends CreatableRepository<Report>,
		FindByIdRepository<Report>,
		QueryableRepository<Report, ReportQuery>,
		PaginatableRepository<Report, ReportQuery>,
		UpdatableByIdRepository<Report> {}

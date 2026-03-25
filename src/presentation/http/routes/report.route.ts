import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { ReportController } from "../controllers/report.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	BlockArticleParamSchema,
	GetReportsQuerySchema,
	ReportArticleParamSchema,
	ReportBodySchema,
	ReportIdParamSchema,
	ReportUserParamSchema,
	UpdateReportStatusBodySchema,
} from "../validators/report.validator";

const router = Router();
const controller = container.get<ReportController>(TYPES.Controllers.Report);

router.use(verifySession);

router.post(
	ROUTES.REPORTS.REPORT_ARTICLE(":articleId"),
	authorizeRoles(["USER", "MENTOR"]),
	validate({ params: ReportArticleParamSchema, body: ReportBodySchema }),
	controller.reportArticle,
);

router.post(
	ROUTES.REPORTS.REPORT_USER(":userId"),
	authorizeRoles(["USER", "MENTOR"]),
	validate({ params: ReportUserParamSchema, body: ReportBodySchema }),
	controller.reportUser,
);

router.get(
	ROUTES.REPORTS.ROOT,
	authorizeRoles(["ADMIN", "SUPER_ADMIN"]),
	validate({ query: GetReportsQuerySchema }),
	controller.getReports,
);

router.patch(
	ROUTES.REPORTS.STATUS(":reportId"),
	authorizeRoles(["ADMIN", "SUPER_ADMIN"]),
	validate({ params: ReportIdParamSchema, body: UpdateReportStatusBodySchema }),
	controller.updateStatus,
);

router.patch(
	ROUTES.REPORTS.BLOCK_ARTICLE(":articleId"),
	authorizeRoles(["ADMIN", "SUPER_ADMIN"]),
	validate({ params: BlockArticleParamSchema }),
	controller.blockArticle,
);

export { router as reportRouter };

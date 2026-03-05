import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants/route-paths";
import type { FileController } from "../controllers/file.controller";
import { verifySession } from "../middlewares/session.middleware";

const fileRouter = Router();
const fileController = container.get<FileController>(TYPES.Controllers.File);

fileRouter.post(
	ROUTES.STORAGE.GET_PRESIGNED_URL,
	verifySession,
	fileController.getPreSignedUploadUrl,
);

export { fileRouter };

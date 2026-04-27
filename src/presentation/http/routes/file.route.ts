import { Router } from "express";
import { apiContainer } from "../../../main/di/api.container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { FileController } from "../controllers/file.controller";
import { validate, verifySession } from "../middlewares";
import {
	DeleteFileBodySchema,
	GetPreSignedUploadUrlBodySchema,
} from "../validators/file.validator";

const fileRouter = Router();
const fileController = apiContainer.get<FileController>(TYPES.Controllers.File);

fileRouter.post(
	ROUTES.STORAGE.GET_PRESIGNED_URL,
	verifySession,
	validate({ body: GetPreSignedUploadUrlBodySchema }),
	fileController.getPreSignedUploadUrl,
);

fileRouter.delete(
	ROUTES.STORAGE.DELETE,
	verifySession,
	validate({ body: DeleteFileBodySchema }),
	fileController.deleteFile,
);

export { fileRouter };

import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { FileController } from "../controllers/file.controller";
import { validate, verifySession } from "../middlewares";
import {
	deleteFileBodySchema,
	getPreSignedUploadUrlBodySchema,
} from "../validators/file.validator";

const fileRouter = Router();
const fileController = container.get<FileController>(TYPES.Controllers.File);

fileRouter.post(
	ROUTES.STORAGE.GET_PRESIGNED_URL,
	verifySession,
	validate({ body: getPreSignedUploadUrlBodySchema }),
	fileController.getPreSignedUploadUrl,
);

fileRouter.delete(
	ROUTES.STORAGE.DELETE,
	verifySession,
	validate({ body: deleteFileBodySchema }),
	fileController.deleteFile,
);

export { fileRouter };

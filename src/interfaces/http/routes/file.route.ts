import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants/route-paths";
import type { FileController } from "../controllers/file.controller";
import { validate } from "../middlewares";
import { verifySession } from "../middlewares/session.middleware";
import { deleteFileBodySchema } from "../validators/file.validator";

const fileRouter = Router();
const fileController = container.get<FileController>(TYPES.Controllers.File);

fileRouter.post(
	ROUTES.STORAGE.GET_PRESIGNED_URL,
	verifySession,
	fileController.getPreSignedUploadUrl,
);

fileRouter.delete(
	ROUTES.STORAGE.DELETE,
	verifySession,
	validate({ body: deleteFileBodySchema }),
	fileController.deleteFile,
);

export { fileRouter };

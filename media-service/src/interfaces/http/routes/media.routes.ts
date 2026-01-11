import { Router } from "express";
import { createMediaController } from "../compositions/media.composition";
import { uploadConfig } from "../middlewares/multer";
//import { authMiddleware, authorizeRoles } from "../middlewares";

export function createMediaRoutes() {
	const router = Router();
	const mediaController = createMediaController();

	//router.use(authMiddleware(),authorizeRoles("user","expert"))

	router.post("/", mediaController.streamMedia);

	router.post("/generate-signature", mediaController.generateSignature);
	router.post(
		"/upload",
		uploadConfig.single("file"),
		mediaController.uploadMedia,
	);

	router.post("/signed-url", mediaController.getSignedViewUrl);

	router.delete("/:publicId/:mediaType", mediaController.deleteMedia);
	return router;
}

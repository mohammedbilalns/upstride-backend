import { Router } from "express";
import { createMediaController } from "../compositions/media.composition";
//import { authMiddleware, authorizeRoles } from "../middlewares";

export function createMediaRoutes() {
	const router = Router();
	const mediaController = createMediaController();

	//router.use(authMiddleware(),authorizeRoles("user","expert"))

	router.post("/", mediaController.streamMedia);

	router.post("/generate-signature", mediaController.generateSignature);

	router.delete("/:publicId/:mediaType", mediaController.deleteMedia);
	return router;
}

import { Router } from "express";
import { createMediaController } from "../compositions/media.composition";
//import { authMiddleware, authorizeRoles } from "../middlewares";

export function createMediaRoutes() {
  const router = Router();
  const mediaController = createMediaController();

  //router.use(authMiddleware(),authorizeRoles("user","expert"))

  router.get("/health", (_req, res) => {
    res.json({
      success: true,
      message: "server is running fine ",
    });
  });

  router.post("/generate-signature", mediaController.generateSignature);
  // router.post("/save-media", mediaController.saveMedia);
  router.get("/get-media", mediaController.getMedia);
  router.post("/get-medias", mediaController.getMedias);
  router.delete("/:publicId/:mediaType", mediaController.deleteMedia);
  return router;
}

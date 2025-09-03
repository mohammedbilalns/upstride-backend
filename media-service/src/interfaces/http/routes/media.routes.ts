import { Router } from "express";
import { createMediaController } from "../compositions/media.composition";

export function createMediaRoutes() {
  const router = Router();
  const mediaController = createMediaController();
  router.post("/generateSignature", mediaController.generateSingnateure);
  router.post("/saveMedia", mediaController.saveMedia);
  router.post("/getMedia", mediaController.getMedia);
  router.post("/getMedias", mediaController.getMedias);
  router.post("/deleteMedia", mediaController.deleteMedia);
  return router;
}

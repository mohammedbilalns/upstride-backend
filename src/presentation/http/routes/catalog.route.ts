import { Router } from "express";
import { container } from "../../../main/container";
import { ROUTES } from "../constants";
import { CatalogController } from "../controllers";

const router = Router();
const catalogController = container.get(CatalogController);

router.get(ROUTES.CATALOG.FETCH, catalogController.fetchCatalog);
router.get(ROUTES.CATALOG.ONBOARDING, catalogController.getOnboardingCatalog);
router.get(ROUTES.CATALOG.PROFESSIONS, catalogController.getProfessions);

export { router as catalogRouter };

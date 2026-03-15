import { Router } from "express";
import { container } from "../../../main/container";
import { ROUTES } from "../constants";
import { CatalogController } from "../controllers";

const router = Router();
const catalogController = container.get(CatalogController);

router.get(ROUTES.CATALOG.FETCH, catalogController.fetchCatalog);
router.get(ROUTES.CATALOG.ONBOARDING, catalogController.getOnboardingCatalog);
router.get(ROUTES.CATALOG.PROFESSIONS, catalogController.getProfessions);

router.post(ROUTES.CATALOG.ADD_INTEREST, catalogController.addInterest);
router.patch(
	ROUTES.CATALOG.DISABLE_INTEREST(":id"),
	catalogController.disableInterest,
);

router.post(ROUTES.CATALOG.ADD_SKILL, catalogController.addSkill);
router.patch(
	ROUTES.CATALOG.DISABLE_SKILL(":id"),
	catalogController.disableSkill,
);

router.post(ROUTES.CATALOG.ADD_PROFESSION, catalogController.addProfession);
router.patch(
	ROUTES.CATALOG.DISABLE_PROFESSION(":id"),
	catalogController.disableProfession,
);

export { router as catalogRouter };

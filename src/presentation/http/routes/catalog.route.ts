import { Router } from "express";
import { container } from "../../../main/container";
import { ROUTES } from "../constants";
import { CatalogController } from "../controllers";
import { validate } from "../middlewares";
import {
	addInterestBodySchema,
	addProfessionBodySchema,
	addSkillBodySchema,
} from "../validators/catalog";

const router = Router();
const catalogController = container.get(CatalogController);

router.get(ROUTES.CATALOG.FETCH, catalogController.fetchCatalog);
router.get(ROUTES.CATALOG.ONBOARDING, catalogController.getOnboardingCatalog);
router.get(ROUTES.CATALOG.PROFESSIONS, catalogController.getProfessions);

router.post(
	ROUTES.CATALOG.ADD_INTEREST,
	validate({ body: addInterestBodySchema }),
	catalogController.addInterest,
);
router.patch(
	ROUTES.CATALOG.DISABLE_INTEREST(":id"),
	catalogController.disableInterest,
);
router.patch(
	ROUTES.CATALOG.ENABLE_INTEREST(":id"),
	catalogController.enableInterest,
);

router.post(
	ROUTES.CATALOG.ADD_SKILL,
	validate({ body: addSkillBodySchema }),
	catalogController.addSkill,
);
router.patch(
	ROUTES.CATALOG.DISABLE_SKILL(":id"),
	catalogController.disableSkill,
);
router.patch(ROUTES.CATALOG.ENABLE_SKILL(":id"), catalogController.enableSkill);

router.post(
	ROUTES.CATALOG.ADD_PROFESSION,
	validate({ body: addProfessionBodySchema }),
	catalogController.addProfession,
);
router.patch(
	ROUTES.CATALOG.DISABLE_PROFESSION(":id"),
	catalogController.disableProfession,
);
router.patch(
	ROUTES.CATALOG.ENABLE_PROFESSION(":id"),
	catalogController.enableProfession,
);

export { router as catalogRouter };

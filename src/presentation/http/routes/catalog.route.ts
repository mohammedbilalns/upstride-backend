import { Router } from "express";
import { apiContainer } from "../../../main/di/api.container";
import { ROUTES } from "../constants";
import { CatalogController } from "../controllers";
import { validate } from "../middlewares";
import {
	AddInterestBodySchema,
	AddProfessionBodySchema,
	AddSkillBodySchema,
	updateCatalogParamsSchema,
	updateInterestBodySchema,
	updateProfessionBodySchema,
	updateSkillBodySchema,
} from "../validators/catalog";

const router = Router();
const catalogController = apiContainer.get(CatalogController);

router.get(ROUTES.CATALOG.FETCH, catalogController.fetchCatalog);
router.get(ROUTES.CATALOG.ONBOARDING, catalogController.getOnboardingCatalog);
router.get(ROUTES.CATALOG.PROFESSIONS, catalogController.getProfessions);

router.post(
	ROUTES.CATALOG.ADD_INTEREST,
	validate({ body: AddInterestBodySchema }),
	catalogController.addInterest,
);
router.patch(
	ROUTES.CATALOG.DISABLE_INTEREST(":id"),
	validate({ params: updateCatalogParamsSchema }),
	catalogController.disableInterest,
);
router.patch(
	ROUTES.CATALOG.ENABLE_INTEREST(":id"),
	validate({ params: updateCatalogParamsSchema }),
	catalogController.enableInterest,
);

router.post(
	ROUTES.CATALOG.ADD_SKILL,
	validate({ body: AddSkillBodySchema }),
	catalogController.addSkill,
);
router.patch(
	ROUTES.CATALOG.DISABLE_SKILL(":id"),
	validate({ params: updateCatalogParamsSchema }),
	catalogController.disableSkill,
);
router.patch(
	ROUTES.CATALOG.ENABLE_SKILL(":id"),
	validate({ params: updateCatalogParamsSchema }),
	catalogController.enableSkill,
);

router.post(
	ROUTES.CATALOG.ADD_PROFESSION,
	validate({ body: AddProfessionBodySchema }),
	catalogController.addProfession,
);
router.patch(
	ROUTES.CATALOG.DISABLE_PROFESSION(":id"),
	validate({ params: updateCatalogParamsSchema }),
	catalogController.disableProfession,
);
router.patch(
	ROUTES.CATALOG.ENABLE_PROFESSION(":id"),
	validate({ params: updateCatalogParamsSchema }),
	catalogController.enableProfession,
);

router.patch(
	ROUTES.CATALOG.UPDATE_SKILL(":id"),
	validate({ params: updateCatalogParamsSchema, body: updateSkillBodySchema }),
	catalogController.updateSkill,
);

router.patch(
	ROUTES.CATALOG.UPDATE_INTEREST(":id"),
	validate({
		params: updateCatalogParamsSchema,
		body: updateInterestBodySchema,
	}),
	catalogController.updateInterest,
);

router.patch(
	ROUTES.CATALOG.UPDATE_PROFESSION(":id"),
	validate({
		params: updateCatalogParamsSchema,
		body: updateProfessionBodySchema,
	}),
	catalogController.updateProfession,
);

export { router as catalogRouter };

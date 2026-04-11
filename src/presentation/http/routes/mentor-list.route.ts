import { Router } from "express";
import { apiContainer } from "../../../main/api.container";
import { ROUTES } from "../constants";
import { MentorListController } from "../controllers/mentor-list.controller";
import { validate, verifySession } from "../middlewares";
import {
	AddMentorToListBodySchema,
	CreateMentorListBodySchema,
	MentorListIdParamSchema,
	RemoveMentorFromListParamsSchema,
} from "../validators";

const router = Router();
const controller = apiContainer.get(MentorListController);

router.use(verifySession);

router.get(ROUTES.MENTOR_LISTS.ROOT, controller.getLists.bind(controller));

router.get(
	ROUTES.MENTOR_LISTS.BY_ID,
	validate({ params: MentorListIdParamSchema }),
	controller.getList,
);

router.post(
	ROUTES.MENTOR_LISTS.ROOT,
	validate({ body: CreateMentorListBodySchema }),
	controller.createList,
);

router.post(
	ROUTES.MENTOR_LISTS.ADD_MENTOR,
	validate({
		params: MentorListIdParamSchema,
		body: AddMentorToListBodySchema,
	}),
	controller.addMentor,
);

router.delete(
	ROUTES.MENTOR_LISTS.REMOVE_MENTOR,
	validate({ params: RemoveMentorFromListParamsSchema }),
	controller.removeMentor,
);

router.delete(
	ROUTES.MENTOR_LISTS.BY_ID,
	validate({ params: MentorListIdParamSchema }),
	controller.deleteList,
);

export { router as mentorListRouter };

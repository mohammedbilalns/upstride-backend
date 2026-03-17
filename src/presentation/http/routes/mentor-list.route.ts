import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { MentorListController } from "../controllers/mentor-list.controller";
import { validate, verifySession } from "../middlewares";
import {
	AddMentorToListBodySchema,
	CreateMentorListBodySchema,
	MentorIdParamSchema,
	MentorListIdParamSchema,
} from "../validators";

const router = Router();
const controller = container.get<MentorListController>(
	TYPES.Controllers.MentorList,
);

router.use(verifySession);

router.get(ROUTES.MENTOR_LISTS.ROOT, controller.getLists.bind(controller));

router.get(
	ROUTES.MENTOR_LISTS.BY_ID,
	validate({ params: MentorListIdParamSchema }),
	controller.getList.bind(controller),
);

router.post(
	ROUTES.MENTOR_LISTS.ROOT,
	validate({ body: CreateMentorListBodySchema }),
	controller.createList.bind(controller),
);

router.post(
	ROUTES.MENTOR_LISTS.ADD_MENTOR,
	validate({
		params: MentorListIdParamSchema,
		body: AddMentorToListBodySchema,
	}),
	controller.addMentor.bind(controller),
);

router.delete(
	ROUTES.MENTOR_LISTS.REMOVE_MENTOR,
	validate({ params: MentorListIdParamSchema.merge(MentorIdParamSchema) }),
	controller.removeMentor.bind(controller),
);

router.delete(
	ROUTES.MENTOR_LISTS.BY_ID,
	validate({ params: MentorListIdParamSchema }),
	controller.deleteList.bind(controller),
);

export { router as mentorListRouter };

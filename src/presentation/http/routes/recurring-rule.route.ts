import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { RecurringRuleController } from "../controllers/recurring-rule.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	addRecurringRuleBodySchema,
	ruleIdParamSchema,
	updateRecurringRuleBodySchema,
} from "../validators/recurring-rule.validator";

const recurringRuleRouter = Router();
const recurringRuleController = container.get<RecurringRuleController>(
	TYPES.Controllers.RecurringRule,
);

recurringRuleRouter.get(
	ROUTES.RECURRING_RULES.ROOT,
	verifySession,
	authorizeRoles(["MENTOR"]),
	recurringRuleController.getRules,
);

recurringRuleRouter.post(
	ROUTES.RECURRING_RULES.ROOT,
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ body: addRecurringRuleBodySchema }),
	recurringRuleController.addRule,
);

recurringRuleRouter.patch(
	ROUTES.RECURRING_RULES.BY_ID,
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ params: ruleIdParamSchema, body: updateRecurringRuleBodySchema }),
	recurringRuleController.updateRule,
);

recurringRuleRouter.delete(
	ROUTES.RECURRING_RULES.BY_ID,
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ params: ruleIdParamSchema }),
	recurringRuleController.deleteRule,
);

recurringRuleRouter.patch(
	ROUTES.RECURRING_RULES.ENABLE(":ruleId"),
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ params: ruleIdParamSchema }),
	recurringRuleController.enableRule,
);

recurringRuleRouter.patch(
	ROUTES.RECURRING_RULES.DISABLE(":ruleId"),
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ params: ruleIdParamSchema }),
	recurringRuleController.disableRule,
);

export { recurringRuleRouter };

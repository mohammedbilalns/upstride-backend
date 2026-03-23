import { Router } from "express";
import { ROUTES } from "../constants";
import { adminManagementRouter } from "./admin-management.route";
import { authRouter } from "./auth.route";
import { catalogRouter } from "./catalog.route";
import { fileRouter } from "./file.route";
import { mentorRouter } from "./mentor.route";
import { mentorListRouter } from "./mentor-list.route";
import { paymentRouter } from "./payment.route";
import { platformSettingsRouter } from "./platform-settings.route";
import { profileRouter } from "./profile.route";
import { recurringRuleRouter } from "./recurring-rule.route";
import { sessionBookingRouter } from "./session-booking.route";
import { sessionSlotRouter } from "./session-slot.route";
import { userManagementRouter } from "./user-management.route";
import { walletRouter } from "./wallet.route";

export const router = Router();

router.use("/test", async (_req, res) => {
	res.send("Running..");
});

router.use(ROUTES.AUTH.BASE, authRouter);
router.use(ROUTES.PROFILE.BASE, profileRouter);
router.use(ROUTES.CATALOG.BASE, catalogRouter);
router.use(ROUTES.USER_MANAGEMENT.BASE, userManagementRouter);
router.use(ROUTES.ADMIN_MANAGEMENT.BASE, adminManagementRouter);
router.use(ROUTES.STORAGE.BASE, fileRouter);
router.use(ROUTES.MENTOR.BASE, mentorRouter);
router.use(ROUTES.MENTOR_LISTS.BASE, mentorListRouter);
router.use(ROUTES.RECURRING_RULES.BASE, recurringRuleRouter);
router.use(ROUTES.SESSION_SLOTS.BASE, sessionSlotRouter);
router.use(ROUTES.SESSION_BOOKINGS.BASE, sessionBookingRouter);
router.use(ROUTES.PLATFORM_SETTINGS.BASE, platformSettingsRouter);
router.use(ROUTES.PAYMENTS.BASE, paymentRouter);
router.use(ROUTES.WALLET.BASE, walletRouter);

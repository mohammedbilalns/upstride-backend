import { Router } from "express";
import { ROUTES } from "../constants";
import { adminsRouter } from "./admin.route";
import { articleRouter } from "./article.route";
import { authRouter } from "./auth.route";
import { availabilityRouter } from "./availability.route";
import { bookingRouter } from "./booking.route";
import { catalogRouter } from "./catalog.route";
import { chatRouter } from "./chat.route";
import { dashboardRouter } from "./dashboard.route";
import { fileRouter } from "./file.route";
import { mentorRouter } from "./mentor.route";
import { mentorListRouter } from "./mentor-list.route";
import { notificationRouter } from "./notification.route";
import { paymentRouter } from "./payment.route";
import { profileRouter } from "./profile.route";
import { reportRouter } from "./report.route";
import { usersRouter } from "./user.route";
import { walletRouter } from "./wallet.route";

export const router = Router();

router.use("/test", async (_req, res) => {
	res.send("Running..");
});

router.use(ROUTES.AUTH.BASE, authRouter);
router.use(ROUTES.ARTICLES.BASE, articleRouter);
router.use(ROUTES.PROFILE.BASE, profileRouter);
router.use(ROUTES.CATALOG.BASE, catalogRouter);
router.use(ROUTES.CHATS.BASE, chatRouter);
router.use(ROUTES.USERS.BASE, usersRouter);
router.use(ROUTES.ADMINS.BASE, adminsRouter);
router.use(ROUTES.STORAGE.BASE, fileRouter);
router.use(ROUTES.MENTOR.BASE, mentorRouter);
router.use(ROUTES.MENTOR_LISTS.BASE, mentorListRouter);
router.use(ROUTES.NOTIFICATIONS.BASE, notificationRouter);
router.use(ROUTES.REPORTS.BASE, reportRouter);
router.use(ROUTES.PAYMENTS.BASE, paymentRouter);
router.use(ROUTES.WALLET.BASE, walletRouter);
router.use(ROUTES.AVAILABILITY.BASE, availabilityRouter);
router.use(ROUTES.BOOKINGS.BASE, bookingRouter);
router.use(ROUTES.DASHBOARD.BASE, dashboardRouter);

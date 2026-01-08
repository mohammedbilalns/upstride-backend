import { Router } from "express";
import proxy from "express-http-proxy";
import env from "../../../infra/config/env";
import { proxyOptions } from "../../../infra/config/proxyOptions";
import {
	SERVICE_URL,
	ServiceName,
} from "../../../infra/config/serviceRegistry";
import { createServiceProxy } from "../../../utils/createServiceProxy";
import logger from "../../../utils/logger";
import { filterArticlesByCategory } from "../controllers/articlebycategory.controller";

const router = Router();

router.get("/articles/by-category", filterArticlesByCategory);

router.use(
	"/auth",
	proxy(env.IDENTITY_SERVICE_URL, {
		...proxyOptions,
		proxyReqOptDecorator: (proxyReqOpts, _srcReq) => {
			proxyReqOpts.headers["Content-Type"] = "application/json";
			return proxyReqOpts;
		},
		userResDecorator: (proxyRes, proxyResData, _srcReq, res) => {
			logger.info(
				`Response received from identity service: ${proxyRes.statusCode}`,
			);
			const setCookieHeader = proxyRes.headers["set-cookie"];

			if (setCookieHeader) {
				const modifiedCookies = setCookieHeader.map((cookie) => {
					let modifiedCookie = cookie.replace(/;\s*Domain=[^;]*/i, "");
					if (!modifiedCookie.includes("Path=")) {
						modifiedCookie += "; Path=/";
					}
					return modifiedCookie;
				});
				res.setHeader("set-cookie", modifiedCookies);
			}
			return proxyResData;
		},
	}),
);

const identityProxy = createServiceProxy(
	ServiceName.IDENTITY,
	SERVICE_URL[ServiceName.IDENTITY],
);
const articleProxy = createServiceProxy(
	ServiceName.ARTICLE,
	SERVICE_URL[ServiceName.ARTICLE],
);
const mediaProxy = createServiceProxy(
	ServiceName.MEDIA,
	SERVICE_URL[ServiceName.MEDIA],
);
const notificationProxy = createServiceProxy(
	ServiceName.NOTIFICATION,
	SERVICE_URL[ServiceName.NOTIFICATION],
);
const chatProxy = createServiceProxy(
	ServiceName.CHAT,
	SERVICE_URL[ServiceName.CHAT],
);
const sessionsProxy = createServiceProxy(
	ServiceName.SESSIONS,
	SERVICE_URL[ServiceName.SESSIONS],
);
const paymentProxy = createServiceProxy(
	ServiceName.PAYMENT,
	SERVICE_URL[ServiceName.PAYMENT],
);

router.use("/users", identityProxy);
router.use("/expertise", identityProxy);
router.use("/mentor", identityProxy);
router.use("/profile", identityProxy);
router.use("/connection", identityProxy);

router.use("/media", mediaProxy);

router.use("/articles", articleProxy);
router.use("/tags", articleProxy);
router.use("/comments", articleProxy);
router.use("/reactions", articleProxy);

router.use("/notifications", notificationProxy);

router.use("/chat", chatProxy);

router.use("/sessions", sessionsProxy);
router.use("/slots", sessionsProxy);
router.use("/payments", paymentProxy);

export default router;

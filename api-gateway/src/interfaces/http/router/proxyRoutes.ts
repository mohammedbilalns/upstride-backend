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

router.use(
	"/users",
	createServiceProxy(ServiceName.IDENTITY, SERVICE_URL[ServiceName.IDENTITY]),
);

router.use(
	"/expertise",
	createServiceProxy(ServiceName.IDENTITY, SERVICE_URL[ServiceName.IDENTITY]),
);

router.use(
	"/mentor",
	createServiceProxy(ServiceName.IDENTITY, SERVICE_URL[ServiceName.IDENTITY]),
);

router.use(
	"/profile",
	createServiceProxy(ServiceName.IDENTITY, SERVICE_URL[ServiceName.IDENTITY]),
);

router.use(
	"/connection",
	createServiceProxy(ServiceName.IDENTITY, SERVICE_URL[ServiceName.IDENTITY]),
);

router.use(
	"/media",
	createServiceProxy(ServiceName.MEDIA, SERVICE_URL[ServiceName.MEDIA]),
);

router.use(
	"/articles",
	createServiceProxy(ServiceName.ARTICLE, SERVICE_URL[ServiceName.ARTICLE]),
);

router.use(
	"/tags",
	createServiceProxy(ServiceName.ARTICLE, SERVICE_URL[ServiceName.ARTICLE]),
);

router.use(
	"/comments",
	createServiceProxy(ServiceName.ARTICLE, SERVICE_URL[ServiceName.ARTICLE]),
);

router.use(
	"/reactions",
	createServiceProxy(ServiceName.ARTICLE, SERVICE_URL[ServiceName.ARTICLE]),
);

router.use(
	"/notifications",
	createServiceProxy(
		ServiceName.NOTIFICATION,
		SERVICE_URL[ServiceName.NOTIFICATION],
	),
);

router.use(
	"/chat",
	createServiceProxy(ServiceName.CHAT, SERVICE_URL[ServiceName.CHAT]),
);

export default router;

import { Router } from "express";
import proxy from "express-http-proxy";
import env from "../../../infra/config/env";
import { proxyOptions } from "../../../infra/config/proxyOptions";
import logger from "../../../utils/logger";

const router = Router();

router.get("/articles/by-category", async (req, res) => {
	try {
		const category = req.query.category as string;
		const page = (req.query.page as string) || "1";
		const limit = (req.query.limit as string) || "10";
		const query = req.query.query as string | "";

		// retrieve the users from the identity service
		const response = await fetch(
			`${env.IDENTITY_SERVICE_URL}/api/mentor/${category}`,
		);
		const users = (await response.json()) as string[];

		// build the url to fetch the articles
		const baseUrl = `${env.ARTICLE_SERVICE_URL}/api/articles/by-users`;
		const url = new URL(baseUrl);

		url.searchParams.append("page", page);
		url.searchParams.append("limit", limit);
		url.searchParams.append("query", query);
		users.forEach((id: string) => url.searchParams.append("authorIds", id));

		// fetch the articles
		const articleResponse = await fetch(url);
		const articles = await articleResponse.json();

		res.json(articles);
	} catch (err: any) {
		console.error(err);
		res
			.status(500)
			.json({ message: "Internal server error", error: err?.message });
	}
});

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
	proxy(env.IDENTITY_SERVICE_URL, {
		...proxyOptions,
		proxyReqOptDecorator: (proxyReqOpts, _srcReq) => {
			proxyReqOpts.headers["Content-Type"] = "application/json";
			return proxyReqOpts;
		},
		userResDecorator: (proxyRes, proxyResData, _srcReq, _res) => {
			logger.info(
				`Response received from identity service: ${proxyRes.statusCode}`,
			);

			return proxyResData;
		},
	}),
);

router.use(
	"/expertise",
	proxy(env.IDENTITY_SERVICE_URL, {
		...proxyOptions,
		proxyReqOptDecorator: (proxyReqOpts, _srcReq) => {
			proxyReqOpts.headers["Content-Type"] = "application/json";
			return proxyReqOpts;
		},
		userResDecorator: (proxyRes, proxyResData, _srcReq, _res) => {
			logger.info(
				`Response received from identity service: ${proxyRes.statusCode}`,
			);

			return proxyResData;
		},
	}),
);

router.use(
	"/mentor",
	proxy(env.IDENTITY_SERVICE_URL, {
		...proxyOptions,
		proxyReqOptDecorator: (proxyReqOpts, _srcReq) => {
			proxyReqOpts.headers["Content-Type"] = "application/json";
			return proxyReqOpts;
		},
		userResDecorator: (proxyRes, proxyResData, _srcReq, _res) => {
			logger.info(
				`Response received from identity service: ${proxyRes.statusCode}`,
			);

			return proxyResData;
		},
	}),
);

router.use(
	"/media",
	proxy(env.MEDIA_SERVICE_URL, {
		...proxyOptions,
		proxyReqOptDecorator: (proxyReqOpts, _srcReq) => {
			proxyReqOpts.headers["Content-Type"] = "application/json";
			return proxyReqOpts;
		},
		userResDecorator: (proxyRes, proxyResData, _srcReq, _res) => {
			logger.info(
				`Response received from Media service: ${proxyRes.statusCode}`,
			);
			return proxyResData;
		},
	}),
);

router.use(
	"/articles",
	proxy(env.ARTICLE_SERVICE_URL, {
		...proxyOptions,
		proxyReqOptDecorator: (proxyReqOpts, _srcReq) => {
			proxyReqOpts.headers["content-type"] = "application/json";
			return proxyReqOpts;
		},
		userResDecorator: (proxyRes, proxyResData, _srcReq, _res) => {
			logger.info(
				`Response recieved from article service: ${proxyRes.statusCode} `,
			);
			return proxyResData;
		},
	}),
);

router.use(
	"/tags",
	proxy(env.ARTICLE_SERVICE_URL, {
		...proxyOptions,
		proxyReqOptDecorator: (proxyReqOpts, _srcReq) => {
			proxyReqOpts.headers["Content-Type"] = "application/json";
			return proxyReqOpts;
		},
		userResDecorator: (proxyRes, proxyResData, _srcReq, _res) => {
			logger.info(
				`Response received from article service: ${proxyRes.statusCode}`,
			);
			return proxyResData;
		},
	}),
);

router.use(
	"/comments",
	proxy(env.ARTICLE_SERVICE_URL, {
		...proxyOptions,
		proxyReqOptDecorator: (proxyReqOpts, _srcReq) => {
			proxyReqOpts.headers["Content-Type"] = "application/json";
			return proxyReqOpts;
		},
		userResDecorator: (proxyRes, proxyResData, _srcReq, _res) => {
			logger.info(
				`Response received from article service: ${proxyRes.statusCode}`,
			);
			return proxyResData;
		},
	}),
);

router.use(
	"/reactions",
	proxy(env.ARTICLE_SERVICE_URL, {
		...proxyOptions,
		proxyReqOptDecorator: (proxyReqOpts, _srcReq) => {
			proxyReqOpts.headers["Content-Type"] = "application/json";
			return proxyReqOpts;
		},
		userResDecorator: (proxyRes, proxyResData, _srcReq, _res) => {
			logger.info(
				`Response received from article service: ${proxyRes.statusCode}`,
			);
			return proxyResData;
		},
	}),
);

export default router;

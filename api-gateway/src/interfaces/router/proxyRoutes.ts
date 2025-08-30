import { Router } from "express";
import proxy from "express-http-proxy";
import env from "../../infra/config/env";
import { proxyOptions } from "../../infra/config/proxyOptions";
import logger from "../../utils/logger";
const router = Router();

router.use("/auth", proxy(env.IDENTITY_SERVICE_URL, {
	...proxyOptions,
	proxyReqOptDecorator: (proxyReqOpts, _srcReq) => {
		proxyReqOpts.headers["Content-Type"] = "application/json";
		return proxyReqOpts;
	},
	userResDecorator: (proxyRes, proxyResData, _srcReq, res) => {
		logger.info(`Response received from identity service: ${proxyRes.statusCode}`);
		const setCookieHeader = proxyRes.headers["set-cookie"];

		if (setCookieHeader) {
			const modifiedCookies = setCookieHeader.map(cookie => {
				let modifiedCookie = cookie.replace(/;\s*Domain=[^;]*/i, '');
				if (!modifiedCookie.includes('Path=')) {
					modifiedCookie += '; Path=/';
				}
				return modifiedCookie;
			});	
			res.setHeader("set-cookie", modifiedCookies);
		} 
		return proxyResData;
	}
}));


router.use("/users", proxy(env.IDENTITY_SERVICE_URL, {
	...proxyOptions,
	proxyReqOptDecorator: (proxyReqOpts, _srcReq) => {
		proxyReqOpts.headers["Content-Type"] = "application/json";
		return proxyReqOpts;
	},
	userResDecorator: (proxyRes, proxyResData, _srcReq, _res) => {
		logger.info(`Response received from identity service: ${proxyRes.statusCode}`);
	
		return proxyResData;
	}
}));


router.use("/expertise", proxy(env.IDENTITY_SERVICE_URL, {
	...proxyOptions,
	proxyReqOptDecorator: (proxyReqOpts, _srcReq) => {
		proxyReqOpts.headers["Content-Type"] = "application/json";
		return proxyReqOpts;
	},
	userResDecorator: (proxyRes, proxyResData, _srcReq, _res) => {
		logger.info(`Response received from identity service: ${proxyRes.statusCode}`);
	
		return proxyResData;
	}
}));



router.use("/mentor", proxy(env.IDENTITY_SERVICE_URL, {
	...proxyOptions,
	proxyReqOptDecorator: (proxyReqOpts, _srcReq) => {
		proxyReqOpts.headers["Content-Type"] = "application/json";
		return proxyReqOpts;
	},
	userResDecorator: (proxyRes, proxyResData, _srcReq, _res) => {
		logger.info(`Response received from identity service: ${proxyRes.statusCode}`);
	
		return proxyResData;
	}
}));
export default router;

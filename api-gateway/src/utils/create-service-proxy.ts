import proxy from "express-http-proxy";
import { proxyOptions } from "../infra/config/proxy-options";
import logger from "./logger";

/**
 * Creates an Express middleware that proxies incoming requests to a target service.
 *
 * Automatically applies base proxy configuration, sets JSON headers,
 * and optionally adjusts authentication cookies for proper domain scoping.
 *
 * @param target_service Name of the target service (used only for logging).
 * @param service_url URL of the target service to forward requests to.
 * @param isAuth Whether to handle authentication cookies (optional).
 * @returns Express middleware configured for proxying.
 */

export function createServiceProxy(
	targetService: string,
	serviceUrl: string,
	isAuth?: boolean,
) {
	const domainRegex = /;\s*Domain=[^;]*/i;

	return proxy(serviceUrl, {
		...proxyOptions,

		// Preserve original Content-Type header if present, otherwise default to JSON
		proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
			// Only set Content-Type if not already provided (e.g., multipart/form-data)
			if (!srcReq.headers["content-type"]) {
				proxyReqOpts.headers["Content-Type"] = "application/json";
			}
			return proxyReqOpts;
		},

		// Modify response before sending to the client
		userResDecorator: (proxyRes, proxyResData, _srcReq, res) => {
			if (isAuth) {
				const setCookieHeader = proxyRes.headers["set-cookie"];

				if (setCookieHeader) {
					const modifiedCookies = setCookieHeader.map((cookie) => {
						let modifiedCookie = cookie.replace(domainRegex, "");
						if (!modifiedCookie.includes("Path=")) {
							modifiedCookie += "; Path=/";
						}
						return modifiedCookie;
					});
					res.setHeader("set-cookie", modifiedCookies);
				}
			}
			logger.info(
				`Response received from ${targetService}: ${proxyRes.statusCode}`,
			);
			return proxyResData;
		},
	});
}

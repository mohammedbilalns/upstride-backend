import crypto from "node:crypto";
import { doubleCsrf } from "csrf-csrf";
import type { Request, RequestHandler } from "express";
import env from "../../../shared/config/env";
import { HttpStatus } from "../../../shared/constants";

const csrfSessionCookieName = "csrfSessionId";
const csrfCookieName =
	env.NODE_ENV === "production"
		? "__Host-psifi.x-csrf-token"
		: "psifi.x-csrf-token";
const csrfSameSite: "none" | "lax" =
	env.NODE_ENV === "production" ? "none" : "lax";

const csrfCookieOptions = {
	sameSite: csrfSameSite,
	path: "/",
	secure: env.NODE_ENV === "production",
	httpOnly: true,
};

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
	getSecret: () => env.CSRF_SECRET,
	getSessionIdentifier: (req: Request) =>
		req.cookies[csrfSessionCookieName] ??
		req.cookies.refreshToken ??
		"anonymous",
	cookieName: csrfCookieName,
	cookieOptions: csrfCookieOptions,
	getCsrfTokenFromRequest: (req: Request) => req.headers["x-csrf-token"],
});

const ensureCsrfSessionId: RequestHandler = (req, res, next) => {
	if (!req.cookies[csrfSessionCookieName]) {
		const sessionId = crypto.randomUUID();
		res.cookie(csrfSessionCookieName, sessionId, csrfCookieOptions);
		req.cookies[csrfSessionCookieName] = sessionId;
	}
	next();
};

const csrfProtection: RequestHandler = (req, res, next) => {
	doubleCsrfProtection(req, res, (err: unknown) => {
		if (err) {
			res.status(HttpStatus.FORBIDDEN).json({
				success: false,
				message: "Invalid CSRF token",
			});
			return;
		}
		next();
	});
};

export { csrfProtection, ensureCsrfSessionId, generateCsrfToken };

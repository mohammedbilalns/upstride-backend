import type { Request } from "express";
import { UAParser } from "ua-parser-js";

export function extractDeviceInfo(req: Request) {
	const userAgent = req.headers["user-agent"] || ("unknown" as string);
	const ua = new UAParser(userAgent);
	const deviceType = ua.getDevice().type || "unknown";
	const deviceVendor = ua.getDevice().vendor || "unknown";
	const deviceModel = ua.getDevice().model || "unknown";
	const deviceOsName = ua.getOS().name || "unknown";
	const deviceOsVersion = ua.getOS().version;
	const deviceOs = deviceOsVersion
		? `${deviceOsName} ${deviceOsVersion}`
		: deviceOsName;
	const browser = ua.getBrowser().name || "unknown";
	const ipAddress = req.ip || req.socket?.remoteAddress || "unknown";

	return {
		deviceType,
		deviceVendor,
		deviceModel,
		deviceOs,
		browser,
		ipAddress,
		userAgent,
	};
}

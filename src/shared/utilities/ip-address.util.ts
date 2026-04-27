import { isIPv4 } from "node:net";

export function normalizeIpAddress(ipAddress?: string | null): string {
	if (!ipAddress) {
		return "unknown";
	}

	const normalized = ipAddress.trim();

	if (!normalized) {
		return "unknown";
	}

	if (normalized === "::1") {
		return "127.0.0.1";
	}

	if (normalized.startsWith("::ffff:")) {
		const ipv4 = normalized.slice(7);
		if (isIPv4(ipv4)) {
			return ipv4;
		}
	}

	return normalized;
}

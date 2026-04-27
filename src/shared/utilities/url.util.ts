import env from "../config/env";

export function getClientBaseUrl(): string {
	const raw = env.CLIENT_URL?.trim();
	if (!raw) return "http://localhost:5173";
	if (/^https?:\/\//i.test(raw)) return raw.replace(/\/+$/, "");
	return `http://${raw.replace(/\/+$/, "")}`;
}

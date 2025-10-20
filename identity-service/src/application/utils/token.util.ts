import * as crypto from "node:crypto";

/**
 * Generates a URL-safe, cryptographically secure random token
 * @param length Length in bytes (default: 32 → ~43 chars in base64url)
 */

export function generateSecureToken(length: number = 32): string {
	return crypto.randomBytes(length).toString("hex");
}

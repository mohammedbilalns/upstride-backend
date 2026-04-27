export function parseNameFromEmail(email: string): string {
	return email.split("@")[0].trim();
}

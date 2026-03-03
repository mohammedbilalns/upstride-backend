import fs from "node:fs";
import path from "node:path";

export class MailRenderer {
	private static readonly TEMPLATES_DIR = path.resolve(
		process.cwd(),
		"src/infrastructure/mail/templates/html",
	);
	private static layout: string | null = null;

	private static getLayout(): string {
		if (!MailRenderer.layout) {
			MailRenderer.layout = fs.readFileSync(
				path.join(MailRenderer.TEMPLATES_DIR, "layout.html"),
				"utf-8",
			);
		}
		return MailRenderer.layout;
	}

	static render(templateName: string, data: Record<string, string>): string {
		const templatePath = path.join(
			MailRenderer.TEMPLATES_DIR,
			`${templateName}.html`,
		);
		let content = fs.readFileSync(templatePath, "utf-8");

		for (const [key, value] of Object.entries(data)) {
			content = content.replace(new RegExp(`{{${key}}}`, "g"), value);
		}

		// Wrap in layout
		let layout = MailRenderer.getLayout();
		layout = layout.replace(
			"{{subject}}",
			templateName.replace(/-/g, " ").toUpperCase(),
		); // Fallback or pass subject
		layout = layout.replace("{{content}}", content);

		return layout;
	}
}

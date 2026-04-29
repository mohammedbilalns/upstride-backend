import fs from "node:fs";
import path from "node:path";

export class MailRenderer {
	private static readonly _TEMPLATES_DIR = path.resolve(
		__dirname,
		"src/infrastructure/mail/templates/html",
	);
	private static _layout: string | null = null;

	private static _getLayout(): string {
		if (!MailRenderer._layout) {
			MailRenderer._layout = fs.readFileSync(
				path.join(MailRenderer._TEMPLATES_DIR, "layout.html"),
				"utf-8",
			);
		}
		return MailRenderer._layout;
	}

	static render(templateName: string, data: Record<string, string>): string {
		const templatePath = path.join(
			MailRenderer._TEMPLATES_DIR,
			`${templateName}.html`,
		);
		let content = fs.readFileSync(templatePath, "utf-8");

		for (const [key, value] of Object.entries(data)) {
			content = content.replace(new RegExp(`{{${key}}}`, "g"), value);
		}

		// Wrap in layout
		let layout = MailRenderer._getLayout();
		layout = layout.replace(
			"{{subject}}",
			templateName.replace(/-/g, " ").toUpperCase(),
		);
		layout = layout.replace("{{content}}", content);

		return layout;
	}
}

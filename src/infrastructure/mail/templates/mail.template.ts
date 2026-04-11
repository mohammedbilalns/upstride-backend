export interface IMailTemplate {
	readonly purpose: string;
	readonly subject: string;

	render(data: unknown): {
		html: string;
		text?: string;
	};
}

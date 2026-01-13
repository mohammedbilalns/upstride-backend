import nodemailer, { type Transporter } from "nodemailer";
import env from "./env";

export function createTransporter(): Transporter {
	return nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: env.EMAIL_USER,
			pass: env.EMAIL_PASS,
		},
	});
}

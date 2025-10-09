import eventBus from "../eventBus";

export async function registerUserConsumer() {
	await eventBus.subscribe<{ userId: string; email: string }>(
		"user.registered",
		async (payload) => {
			// 🔹 Your business logic for handling user registration
			console.log("✅ User registered event consumed:", payload);

			// Example: send welcome email
			// await emailService.sendWelcome(payload.email)
		},
	);
}

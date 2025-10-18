import eventBus from "../eventBus";

export async function registerUserConsumer() {
	await eventBus.subscribe<{ userId: string; email: string }>(
		"user.registered",
		async (payload) => {
			console.log("✅ User registered event consumed:", payload);

		},
	);
}

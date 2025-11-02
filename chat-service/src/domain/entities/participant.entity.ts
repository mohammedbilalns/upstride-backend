export interface Participant {
	id: string;
	name: string;
	userId: string;
	profilePicture: string;
	role?: "MEMBER" | "ADMIN";
	chatId: string;
	jointedAt?: Date;
	lastReadAt: Date;
	isMuted: boolean;
}

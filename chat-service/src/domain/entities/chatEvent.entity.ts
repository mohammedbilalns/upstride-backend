export interface ChatEvent {
  id: string;
  chatId: string;
  actorId: string; 
  eventType: "CHAT_RENAMED" |"MEMBER_ADDED"| "MEMBER_REMOVED";
  metaData?: Record<string, string>
  createdAt: Date
}

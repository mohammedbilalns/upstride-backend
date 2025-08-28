export interface Mentor {
  id: string;
  userId: string;
  expertiseId: string;
  customFields: Record<string, any>;
  status: "pending" | "approved" | "rejected";
}

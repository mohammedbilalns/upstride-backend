export interface Expert {
  id: string
  userId: string
  professionId: string
  customFields: Record<string, any>
  status: "pending" | "approved" | "rejected"
}

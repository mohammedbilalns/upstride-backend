export interface Professional {
  id: string
  userId: string
  professionId: string
  customFields: Record<string, any>
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
}
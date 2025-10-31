export interface Chat {
  id: string,
  type: "DIRECT" | "GROUP",
  name?: string,
  description?: string, 
  avatar?: string,
  isArchived: boolean,
  createdAt: Date,
  updatedAt: Date
}

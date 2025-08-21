export interface User {
  id: string
  name: string
  email: string,
  profilePicture?: string
  isBlocked: boolean
  googleId?: string
  passwordHash?: string
  isVerified: boolean
  roles: ("user" | "professional" | "admin")[]
  createdAt?: Date
  updatedAt?: Date
}


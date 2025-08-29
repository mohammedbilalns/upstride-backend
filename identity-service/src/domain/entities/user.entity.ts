export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePicture?: string;
  isBlocked: boolean;
  googleId?: string;
  passwordHash?: string;
  isVerified: boolean;
  role: "user" | "expert" | "admin" | "superadmin";
  createdAt: Date;
  updatedAt?: Date;
}

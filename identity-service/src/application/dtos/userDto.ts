export interface UserDTO {
  id: string;
  name: string;
  email: string;
  roles: ("user" | "professional" | "admin")[];
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  googleId?: string;
  profilePicture?: string;
}
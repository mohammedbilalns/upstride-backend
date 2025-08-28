export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: "user" | "expert" | "admin" | "superadmin";
  profilePicture?: string;
}

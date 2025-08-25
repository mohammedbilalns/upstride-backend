export interface UserDTO {
  id: string;
  name: string;
  email: string;
  roles: ("user" | "professional" | "admin")[];
  profilePicture?: string;
}

export interface Participant{

  id: string; 
  name: string; 
  userId: string;
  role?: "MEMBER"|"ADMIN";
  jointedAt?: Date,
  lastReadAt: Date,
  isMuted: boolean
}

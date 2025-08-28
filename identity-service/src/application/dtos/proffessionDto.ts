export interface ExpertiseDto {
  id: string;
  name: string;
  description: string;
  fields: Record<string, any>;
  isActive: boolean;
}

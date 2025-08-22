import { ProfessionDto } from "../../application/dtos/proffessionDto";

export interface IExpertiseService {
	createProfession(name:string, description:string, fields:Record<string,any>, isActive:boolean): Promise<void>
	updateProfession(id:string, name:string, description:string, fields:Record<string,any>, isActive:boolean): Promise<void>
  fetchProfessions(page:number, limit:number): Promise<ProfessionDto[]>
	fetchProfession(id:string): Promise<ProfessionDto>
	saveUserExpertise(userId:string, professionId:string): Promise<void>
	updateUserExpertise(userId:string, professionId:string): Promise<void>
}

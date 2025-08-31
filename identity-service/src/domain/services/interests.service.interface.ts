export interface IInterestsService {
	createInterests(userId:string, expertises:string[], skills:string[]):Promise<void>;
	fetchInterests(userId:string):Promise<{expertises:string[], skills:string[]}>;
}

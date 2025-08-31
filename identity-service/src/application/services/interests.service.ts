import { IUserRepository } from "../../domain/repositories";
import { HttpStatus, ErrorMessage } from "../../common/enums";
import { AppError } from "../errors/AppError";


export class InterestsService implements InterestsService {
	constructor(private _userRepository: IUserRepository){}
	
	async createInterests(userId:string, expertises:string[], skills:string[]):Promise<void>{
		// validate the ids ? 
		await this._userRepository.update(userId, {
			interestedExpertises: expertises,
			interestedSkills: skills,
		});
	}
	async fetchInterests(userId:string):Promise<{expertises:string[], skills:string[]}>{
	
		const user = await this._userRepository.findById(userId);
		if(!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);	
		return {
			expertises: user.interestedExpertises,
			skills: user.interestedSkills,
		};
	}
}

import { ErrorMessage, HttpStatus, QueueEvents } from "../../common/enums";
import { IMentorRepository, IUserRepository } from "../../domain/repositories";
import { IProfileService } from "../../domain/services/profile.service.interface";
import { changePasswordDto, fetchProfileResponseDto, updateProfileDto } from "../dtos/profile.dto";
import { Mentor } from "../../domain/entities";
import { AppError } from "../errors/AppError";
import { ICryptoService } from "../../domain/services";
import { IEventBus } from "../../domain/events/IEventBus";

export class ProfileService implements IProfileService {
	constructor(
		private _userRepository: IUserRepository,
		private _mentorRepository: IMentorRepository,
		private _cryptoService: ICryptoService,
		private _eventBus: IEventBus
	) {}

	async fetchProfileById(userId: string, profileId:string): Promise<fetchProfileResponseDto> {
		const isUser = userId == profileId

		let user = await this._userRepository.findByUserId(profileId);
		if (!user)throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		if(!user.isVerified) throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		let {passwordHash, isBlocked, isVerified, ...userData} = user;
		let mentor : Mentor | null 
		if(userData.role == "mentor"){
			mentor = await this._mentorRepository.findByUserId(profileId,true);
			if(!mentor) throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);
			const {isPending, isRejected, isActive,resumeId, ...mentorData} = mentor 

			const mergedData = {...userData, ...mentorData, ...(isUser && {resumeId})}
			return {...mergedData}
		}
		return { ...userData}
	}

	async updateProfile(userId: string, data: updateProfileDto): Promise<void> {
		let {mentor:MentorData, ...userData} = data;
		if(userId != data.id) throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN)
		const user  =  await this._userRepository.findById(userId);
		if(!user || !user.isVerified)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		if(!MentorData){
			await this._userRepository.update(userId, {...userData});
			return 
		}
		if(user.role !== "mentor") throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);

		const mentor = await this._mentorRepository.findByUserId(userId);
		if( !mentor) throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);
		const [newUser] = await Promise.all([
			this._userRepository.update(userId, {...userData}),
			this._mentorRepository.update(mentor.id, {...MentorData}),
		]);
		if(!newUser) throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		if(data.name || data.profilePicture){
			const {name,profilePicture} = newUser
			this._eventBus.publish(QueueEvents.UPDATE_PROFILE,{userId:user.id,name, profilePicture} )
		}

	}


	async changePassword(userId: string, data: changePasswordDto): Promise<void> {
		const { oldPassword, newPassword } = data;

		const user  =  await this._userRepository.findById(userId);

		if(!user || !user.isVerified)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		if(!user.passwordHash) throw new AppError(ErrorMessage.REGISTERED_WITH_GOOGLE_ID, HttpStatus.FORBIDDEN);
		const validOldPassword = await this._cryptoService.compare(oldPassword, user.passwordHash);
		if(!validOldPassword) throw new AppError(ErrorMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
		const hashedPassword = await this._cryptoService.hash(newPassword);
		await this._userRepository.update(userId, {passwordHash: hashedPassword});

	}
}

import { HttpStatus, ResponseMessage } from "../../../common/enums";
import { IProfileService } from "../../../domain/services/profile.service.interface";
import asyncHandler from "../utils/asyncHandler";
import { changePasswordSchema, fetchProfileSchema } from "../validations/profile.validtions";

export class ProfileController {
	constructor(private _profileService: IProfileService) {}

	fetchProfileById = asyncHandler(async (req, res) => {
		const userId = res.locals?.user?.id
		const {profileId} = fetchProfileSchema.parse(req.params) 
		const data = await this._profileService.fetchProfileById(userId, profileId);
		res.status(HttpStatus.OK).json(data);
	});

	updateProfile = asyncHandler(async (req,res) =>{
		const userId = res.locals.user.id 
	// validate the data here 	
		const data = req.body 
		this._profileService.updateProfile(userId, data)
		// handle updating user data in articles and comments 
		res.status(HttpStatus.OK).json({success:true,message:ResponseMessage.PROFILE_UPDATED})
	}) 
	changePassword = asyncHandler(async (req,res)=>{
		const userId = res.locals.user.id 
		const {oldPassword,newPassword} = changePasswordSchema.parse(req.body)
		this._profileService.changePassword(userId,{oldPassword,newPassword})
		res.status(HttpStatus.OK).json({success:true,message:ResponseMessage.PASSWORD_UPDATED})
	})
}

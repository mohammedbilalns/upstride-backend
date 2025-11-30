import { HttpStatus, ResponseMessage } from "../../../common/enums";
import {
	IChangePasswordUC,
	IFetchProfileUC,
	IUpdateProfileUC,
} from "../../../domain/useCases/profileMangement";
import asyncHandler from "../utils/asyncHandler";
import {
	changePasswordSchema,
	fetchProfileSchema,
	updateProfileSchema,
} from "../validations/profile.validtions";

export class ProfileController {
	constructor(
		private _fetchProfileUc: IFetchProfileUC,
		private _updateProfileUc: IUpdateProfileUC,
		private _changePasswordUc: IChangePasswordUC,
	) {}

	fetchProfileById = asyncHandler(async (req, res) => {
		const { profileId } = fetchProfileSchema.parse(req.params);
		const data = await this._fetchProfileUc.execute(profileId);
		res.status(HttpStatus.OK).json(data);
	});

	updateProfile = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const data = updateProfileSchema.parse(req.body);
		await this._updateProfileUc.execute(userId, data);

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.PROFILE_UPDATED });
	});

	changePassword = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);
		await this._changePasswordUc.execute(userId, {
			oldPassword,
			newPassword,
		});
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.PASSWORD_UPDATED });
	});
}

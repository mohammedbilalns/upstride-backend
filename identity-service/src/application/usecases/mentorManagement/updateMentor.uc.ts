import { ErrorMessage, HttpStatus } from "../../../common/enums";
import {
	IMentorRepository,
	IUserRepository,
} from "../../../domain/repositories";
import { IExpertiseHelperService } from "../../../domain/services/expertiseHelper.service.interface";
import { IUpdateMentorUC } from "../../../domain/useCases/mentorManagement/updateMentor.uc.interface";
import { updateMentoDto } from "../../dtos";
import { AppError } from "../../errors/AppError";

/**
 * Use Case: Update mentor profile information.
 *
 *  - Update mentor details
 */
export class UpdateMentorUC implements IUpdateMentorUC {
	constructor(
		private _userRepository: IUserRepository,
		private _mentorRepository: IMentorRepository,
		private _expertiseHelperService: IExpertiseHelperService,
	) {}

	async execute(dto: updateMentoDto): Promise<void> {
		// validate user and mentor
		const [user, mentor] = await Promise.all([
			this._userRepository.findById(dto.userId),
			this._mentorRepository.findByUserId(dto.userId),
		]);

		if (!user || !user.isVerified)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		if (!mentor) {
			throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		// process new skills
		const newSkillsIds: string[] =
			await this._expertiseHelperService.processNewSkills(
				dto?.newSkills ? dto?.newSkills : [],
				mentor.expertiseId,
			);
		const existingSkillIds: string[] = dto.skills ? dto.skills : [];

		// prepare mentor details
		const mentorDetails = {
			bio: dto.bio,
			currentRole: dto.currentRole,
			organisation: dto.organisation,
			educationalQualifications: dto.educationalQualifications,
			personalWebsite: dto.personalWebsite,
			skillIds: [...existingSkillIds, ...newSkillsIds],
		};

		// update user and mentor records in parallel:
		await Promise.all([
			this._mentorRepository.update(mentor.id, {
				...mentorDetails,
				isPending: true,
			}),
			this._userRepository.update(dto.userId, {
				isRequestedForMentoring: "pending",
				mentorRegistrationCount: (user.mentorRegistrationCount || 0) + 1,
			}),
		]);
	}
}

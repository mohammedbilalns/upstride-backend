import { ErrorMessage, HttpStatus, QueueEvents } from "../../common/enums";
import type { Mentor } from "../../domain/entities";
import type { IEventBus } from "../../domain/events/IEventBus";
import type {
	IMentorRepository,
	IUserRepository,
} from "../../domain/repositories";
import { IConnectionRepository } from "../../domain/repositories/connection.repository.interface";
import type { IMentorService } from "../../domain/services";
import type {
	approveMentorDto,
	findAllMentorsDto,
	findAllMentorsResponseDto,
	findByExpertiseandSkillDto,
	MentorDetailsDto,
	MentorRegistrationDTO,
	rejectMentorDto,
	updateMentoDto,
} from "../dtos/mentor.dto";
import { AppError } from "../errors/AppError";
import {
	APPROVE_SUBJECT,
	buildMentorApprovalEmailHtml,
} from "../utils/mentor.util";
export class MentorService implements IMentorService {
	constructor(
		private _mentorRepository: IMentorRepository,
		private _userRepository: IUserRepository,
		private _connectionRepository: IConnectionRepository,
		private _eventBus: IEventBus,
	) {}

	async createMentor(createMentorDto: MentorRegistrationDTO): Promise<void> {
		const {
			userId,
			bio,
			currentRole,
			organisation,
			yearsOfExperience,
			educationalQualifications,
			personalWebsite,
			resume,
			termsAccepted,
			skills,
			expertise,
		} = createMentorDto;

		const user = await this._userRepository.findById(userId);
		if (!user || !user.isVerified)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		if (user.mentorRegistrationCount && user.mentorRegistrationCount >= 3)
			throw new AppError(
				ErrorMessage.MENTOR_LIMIT_REACHED,
				HttpStatus.BAD_REQUEST,
			);

		if (user.isRequestedForMentoring === "approved") {
			throw new AppError(
				ErrorMessage.MENTOR_ALREADY_APPROVED,
				HttpStatus.BAD_REQUEST,
			);
		}
		const mentorDetails = {
			bio,
			currentRole,
			organisation,
			yearsOfExperience,
			educationalQualifications,
			personalWebsite,
			resumeId: resume.public_id,
			expertiseId: expertise,
			userId,
			termsAccepted,
			skillIds: skills,
			expertise,
		};
		await Promise.all([
			this._mentorRepository.create({ ...mentorDetails, isPending: true }),
			this._userRepository.update(userId, {
				isRequestedForMentoring: "pending",
				mentorRegistrationCount: (user.mentorRegistrationCount || 0) + 1,
			}),
		]);
	}

	async updateMentor(updateMentorDto: updateMentoDto): Promise<void> {
		const {
			userId,
			bio,
			currentRole,
			organisation,
			yearsOfExperience,
			educationalQualifications,
			personalWebsite,
			resume,
			termsAccepted,
			skills,
			expertise,
		} = updateMentorDto;

		const user = await this._userRepository.findById(userId);
		if (!user || !user.isVerified)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		const mentorDetails = {
			bio,
			currentRole,
			organisation,
			yearsOfExperience,
			educationalQualifications,
			personalWebsite,
			resumeId: resume.public_id,
			expertiseId: expertise,
			userId,
			termsAccepted,
			skillIds: skills,
			expertise,
		};
		const mentor = await this._mentorRepository.findByUserId(userId);
		if (!mentor) {
			throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		await Promise.all([
			this._mentorRepository.update(mentor.id, {
				...mentorDetails,
				isPending: true,
			}),
			this._userRepository.update(userId, {
				isRequestedForMentoring: "pending",
				mentorRegistrationCount: (user.mentorRegistrationCount || 0) + 1,
			}),
		]);
	}

	async fetchMentors(
		fetchMentorDto: findAllMentorsDto,
	): Promise<findAllMentorsResponseDto> {
		const { page, limit, query, status } = fetchMentorDto;

		const [mentors, totalMentos, totalPending, totalApproved, totalRejected] =
			await Promise.all([
				this._mentorRepository.findAll({
					page,
					limit,
					query,
					status,
				}),
				this._mentorRepository.count(query),
				this._mentorRepository.count(query, "pending"),
				this._mentorRepository.count(query, "approved"),
				this._mentorRepository.count(query, "rejected"),
			]);

		return {
			mentors,
			totalMentors: totalMentos,
			totalPending,
			totalApproved,
			totalRejected,
		};
	}

	async findByExpertiseandSkill(
		findByExpertiseandSkillDto: findByExpertiseandSkillDto,
	): Promise<{ mentors: Mentor[]; total: number }> {
		const { page, limit, query, expertiseId, skillId, userId } =
			findByExpertiseandSkillDto;
		const mentors = await this._mentorRepository.findByExpertiseandSkill(
			page,
			limit,
			userId,
			expertiseId,
			skillId,
			query,
		);

		return mentors;
	}

	async approveMentor(aproveMentorDto: approveMentorDto): Promise<void> {
		const mentor = await this._mentorRepository.findById(
			aproveMentorDto.mentorId,
		);
		if (!mentor)
			throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);

		const [user, _] = await Promise.all([
			this._userRepository.update(mentor.userId, {
				isRequestedForMentoring: "approved",
				role: "mentor",
			}),
			this._mentorRepository.update(mentor.id, {
				isPending: false,
				isRejected: false,
				isActive: true,
			}),
		]);

		if (!user) {
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		const message = {
			to: user.email,
			subject: APPROVE_SUBJECT,
			text: buildMentorApprovalEmailHtml(user.name),
		};
		await this._eventBus.publish(QueueEvents.SEND_OTP, message);
	}

	async rejectMentor(rejectMentorDto: rejectMentorDto): Promise<void> {
		const { rejectionReason, mentorId } = rejectMentorDto;
		const mentor = await this._mentorRepository.findById(mentorId);
		if (!mentor)
			throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);

		await Promise.all([
			this._userRepository.update(mentor.userId, {
				isRequestedForMentoring: "rejected",
			}),
			this._mentorRepository.update(mentor.id, {
				isActive: false,
				isRejected: true,
				isPending: false,
				rejectionReason,
			}),
		]);
	}

	async getMentorByExpertiseId(expertiseId: string): Promise<string[]> {
		const mentors = await this._mentorRepository.findByExpertiseId(expertiseId);
		return mentors.map((mentor: Mentor) => mentor.userId);
	}

	// public data of the mentor
	async getMentorDetails(
		mentorId: string,
		userId: string,
	): Promise<MentorDetailsDto> {
		const mentor = await this._mentorRepository.findByMentorId(mentorId);
		if (!mentor)
			throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);
		const followConnection =
			await this._connectionRepository.fetchByUserAndMentor(userId, mentorId);
		const isFollowing = !!followConnection;

		if (!mentor)
			throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);
		return { ...mentor, isFollowing };
	}

	async getMe(userId: string): Promise<Mentor> {
		const mentor = await this._mentorRepository.findByUserId(
			userId,
			true,
			true,
		);
		if (!mentor)
			throw new AppError(ErrorMessage.INVALID_USERID, HttpStatus.BAD_REQUEST);
		return mentor;
	}
}

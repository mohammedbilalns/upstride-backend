import { CACHE_TTL } from "../../../common/constants/cacheOptions";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import {
	IExpertiseRepository,
	ISkillRepository,
	IUserRepository,
	IVerificationTokenRepository,
} from "../../../domain/repositories";
import { ITokenService } from "../../../domain/services";
import { ICacheService } from "../../../domain/services/cache.service.interface";
import { ICreateInterestsUC } from "../../../domain/useCases/userRegistration/createInterests.uc.interface";
import {
	createInterestsParam,
	LoginReturn,
	NewTopic,
} from "../../dtos/registration.dto";
import { AppError } from "../../errors/AppError";

export class CreateInterestsUC implements ICreateInterestsUC {
	constructor(
		private _userRepository: IUserRepository,
		private _verficationTokenRepository: IVerificationTokenRepository,
		private _expertiseRepository: IExpertiseRepository,
		private _skillRepository: ISkillRepository,
		private _cacheService: ICacheService,
		private _tokenService: ITokenService,
	) {}

	private async _createNewExpertises(newExpertises: string[]) {
		const newExpertisesMap: Map<string, string> = new Map();
		newExpertises = [...new Set(newExpertises)];

		if (newExpertises.length > 5) {
			throw new AppError(
				ErrorMessage.TOO_MANY_NEW_EXPERTISES,
				HttpStatus.BAD_REQUEST,
			);
		}

		// create new expertises
		const createdExpertises = await Promise.all(
			newExpertises.map((expertise) => {
				return this._expertiseRepository.createIfNotExists({
					name: expertise,
					isVerified: false,
				});
			}),
		);
		createdExpertises.filter((expertise) => expertise !== null);

		if (!createdExpertises)
			throw new AppError(
				ErrorMessage.FAILED_TO_CREATE_EXPERTISES,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);

		// store the new expertises for further reference
		createdExpertises.forEach((expertise) => {
			newExpertisesMap.set(expertise.name, expertise.id);
		});

		return newExpertisesMap;
	}

	private async _createNewTopics(
		newTopics: NewTopic[],
		newExpertisesMap: Map<string, string>,
	) {
		// Max allowed number of created topics
		if (newTopics.length > 5) {
			throw new AppError(
				ErrorMessage.TOO_MANY_NEW_TOPICS,
				HttpStatus.BAD_REQUEST,
			);
		}

		const mappedTopics = newTopics.map((topic) => {
			if (topic.expertiseId) {
				return { name: topic.name, expertiseId: topic.expertiseId! };
			}
			// If name is provided → fetch ID from map
			const expertiseId = newExpertisesMap.get(topic.expertiseName!);
			if (!expertiseId) {
				throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST);
			}
			return { name: topic.name, expertiseId };
		});

		const newSkillIds = await Promise.all(
			mappedTopics.map((topic) =>
				this._skillRepository.createIfNotExists({
					...topic,
					isVerified: false,
				}),
			),
		);
		return newSkillIds.map((skillId) => skillId.id);
	}

	async execute(dto: createInterestsParam): Promise<LoginReturn> {
		let newExpertisesMap: Map<string, string> = new Map();
		let newTopicIds: string[] = [];

		if (dto.newExpertises && dto.newExpertises?.length > 0) {
			newExpertisesMap = await this._createNewExpertises(dto.newExpertises);
		}

		if (dto.newTopics && dto.newTopics.length > 0) {
			newTopicIds = await this._createNewTopics(
				dto.newTopics,
				newExpertisesMap,
			);
		}

		// verify token and fetch user info
		const [validToken, user] = await Promise.all([
			this._verficationTokenRepository.getToken(dto.token, "register"),
			this._userRepository.findByEmail(dto.email),
		]);

		if (!validToken) {
			throw new AppError(ErrorMessage.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
		}
		if (!user)
			throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);

		// generate new tokens
		const { newAccessToken, newRefreshToken } =
			await this._tokenService.generateTokens(user);

		// combine the new expertises and skills with the existing ones
		const combinedExpertises =
			newExpertisesMap.size > 0
				? [...dto.expertises, ...newExpertisesMap.values()]
				: dto.expertises;
		const combinedTopics = [...newTopicIds, ...dto.skills];
		// updaet the user repo
		await this._userRepository.update(user.id, {
			interestedExpertises: combinedExpertises,
			interestedSkills: combinedTopics,
			isVerified: true,
		});

		const { passwordHash, isBlocked, isVerified, googleId, ...publicUser } =
			user;
		// update cache
		this._cacheService.set(
			`user:${user.id}`,
			{ id: user.id, profilePicture: user.profilePicture, name: user.name },
			CACHE_TTL,
		);

		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
			user: publicUser,
		};
	}
}

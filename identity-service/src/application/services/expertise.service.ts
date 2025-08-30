import { IExpertiseService } from "../../domain/services";
import {
  IExpertiseRepository,
  ISkillRepository,
} from "../../domain/repositories";
import {
  createExpertiseDto,
  updateExpertiseDto,
  createSkillDto,
  updateSkillDto,
  fetchExpertiseDto,
  fetchSkillsDto,
} from "../dtos";
import { AppError } from "../errors/AppError";
import { ErrorMessage, HttpStatus } from "../../common/enums";
import { UserRole } from "../../common/enums/userRoles";

export class ExpertiseService implements IExpertiseService {
  constructor(
    private _expertiseRepository: IExpertiseRepository,
    private _skillRepository: ISkillRepository,
  ) {}

  async createExpertise(data: createExpertiseDto): Promise<void> {
    const expertise = await this._expertiseRepository.create({
      name: data.name,
      description: data.description,
      isVerified: true,
    });

    await Promise.all(
      data.skills.map((skill) =>
        this._skillRepository.create({
          name: skill,
          expertiseId: expertise.id,
          isVerified: true,
        }),
      ),
    );
  }

  async updateExpertise(data: updateExpertiseDto): Promise<void> {
    const updateData: Partial<Omit<updateExpertiseDto, "expertiseId">> = {};
    if (data.name) updateData.name = data.name;
    if (data.description) updateData.description = data.description;
    if (data.isVerified) updateData.isVerified = data.isVerified;

    await this._expertiseRepository.update(data.expertiseId, updateData);
  }

  async fetchExpertises(data: fetchExpertiseDto): Promise<any> {
    const [expertises, total] = await Promise.all([
      this._expertiseRepository.findAll(data.page, data.limit, data.query),
      this._expertiseRepository.count(data.query),
    ]);
    const isAdmin = data.userRole == UserRole.ADMIN || UserRole.SUPER_ADMIN;
    const mapped = expertises.map((expertise) => ({
      id: expertise.id,
      name: expertise.name,
      ...(isAdmin && {
        description: expertise.description,
        isVerified: expertise.isVerified,
      }),
    }));

    return { data: mapped, total };
  }

	async verifyExpertise(expertiseId: string): Promise<void> {
		await this._expertiseRepository.update(expertiseId, {isVerified:true}) 
		const skills = await this._skillRepository.findAll(expertiseId);
		await Promise.all(skills.map((skill) => this._skillRepository.update(skill.id, {isVerified:true})))

	}

  async createSkill(data: createSkillDto): Promise<void> {
    const isExists = await this._skillRepository.exists(
      data.name,
      data.expertiseId,
    );
    if (isExists)
      throw new AppError(
        ErrorMessage.SKILL_ALREADY_EXISTS,
        HttpStatus.CONFLICT,
      );

    const isAdmin = data.userRole == UserRole.ADMIN || UserRole.SUPER_ADMIN;
    await this._skillRepository.create({
      name: data.name,
      expertiseId: data.expertiseId,
      isVerified: isAdmin ? true : false,
    });
  }

  async updateSkill(data: updateSkillDto): Promise<void> {
    const updateData: Partial<Omit<updateSkillDto, "skillId">> = {};
    if (data.name) updateData.name = data.name;
    if (data.isVerified) updateData.isVerified = data.isVerified;
    await this._skillRepository.update(data.skillId, updateData);
  }

  async fetchSkills(data: fetchSkillsDto): Promise<any> {
    const [skills, total] = await Promise.all([
      this._skillRepository.findAll(
        data.expertiseId,
        data.page,
        data.limit,
        data.query,
      ),
      this._skillRepository.count(data.expertiseId, data.query),
    ]);

    const isAdmin = data.userRole == UserRole.ADMIN || UserRole.SUPER_ADMIN;
    const mapped = skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      expertiseId: skill.expertiseId,
      ...(isAdmin && {
        isVerified: skill.isVerified,
      }),
    }));

    return { expertises: mapped, total };
  }
}

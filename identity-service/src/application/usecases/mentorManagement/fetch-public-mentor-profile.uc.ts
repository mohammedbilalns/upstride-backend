import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IMentorRepository } from "../../../domain/repositories";
import { Mentor } from "../../../domain/entities/mentor.entity";
import { AppError } from "../../errors/app-error";

export interface IFetchPublicMentorProfileUC {
    execute(mentorId: string): Promise<Mentor>;
}

export class FetchPublicMentorProfileUC implements IFetchPublicMentorProfileUC {
    constructor(private _mentorRepository: IMentorRepository) { }

    async execute(mentorId: string): Promise<Mentor> {
        const mentor = await this._mentorRepository.findByMentorId(mentorId);
        if (!mentor) {
            throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return mentor;
    }
}

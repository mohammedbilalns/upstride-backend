import { ErrorMessage, HttpStatus, QueueEvents } from "../../../common/enums";
import { MailType } from "../../../common/enums/mailTypes";
import { IEventBus } from "../../../domain/events/IEventBus";
import {
	IMentorRepository,
	IUserRepository,
} from "../../../domain/repositories";
import { IApproveMentorUC } from "../../../domain/useCases/mentorManagement/approveMentor.uc.interface";
import { approveMentorDto } from "../../dtos";
import { AppError } from "../../errors/AppError";
import { APPROVE_SUBJECT } from "../../utils/mail.util";

export class ApproveMentorUC implements IApproveMentorUC {
	constructor(
		private _userRepository: IUserRepository,
		private _mentorRepository: IMentorRepository,
		private _eventBus: IEventBus,
	) {}

	/**
	 * Use Case: Approve a mentor application.
	 *
	 *  - Promote user to mentor role
	 *  - Trigger approval email
	 */
	async execute(dto: approveMentorDto): Promise<void> {
		const mentor = await this._mentorRepository.findById(dto.mentorId);
		if (!mentor)
			throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);

		/**
		 * Update user and mentor records in parallel:
		 *  - Promote user to mentor role and mark status as approved
		 *  - Mark mentor profile as active and not pending/rejected
		 */
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
		// approval email event payload
		const message = {
			to: user.email,
			subject: APPROVE_SUBJECT,
			mailType: MailType.APPROVED_MENTOR,
			userName: user.name,
		};
		// publish approval email event
		await this._eventBus.publish(QueueEvents.SEND_MAIL, message);
	}
}

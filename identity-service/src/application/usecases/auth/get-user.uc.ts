import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IMentorRepository, IUserRepository } from "../../../domain/repositories";
import { IGetUserUC } from "../../../domain/useCases/auth/get-user.uc.interface";
import { UserDTO } from "../../dtos";
import { GetUserDto } from "../../dtos/auth.dto";
import { AppError } from "../../errors/app-error";

export class GetUserUC implements IGetUserUC {
  constructor(
    private _userRepository: IUserRepository,
    private _mentorRepository: IMentorRepository
  ) {}

  async execute(dto: GetUserDto): Promise<UserDTO> {

    const user = await this._userRepository.findById(dto.userId);
    if (!user)
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
    if (user?.isBlocked)
      throw new AppError(
        ErrorMessage.BLOCKED_FROM_PLATFORM,
        HttpStatus.FORBIDDEN,
      );
    const mentorDetails = await this._mentorRepository.findByUserId(user.id)
    if(mentorDetails) {
      user.mentorId = mentorDetails.id;
    }
    const { passwordHash, isBlocked, isVerified, googleId, ...publicUser } =
      user;
    return publicUser;
  }
}

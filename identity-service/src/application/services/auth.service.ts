import { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { ICryptoService, IAuthService, ITokenService } from "../../domain/services";
import { UserDTO } from "../../application/dtos/userDto";
import { AppError } from "../errors/AppError";
import { HttpStatus, ErrorMessage } from "../../common/enums";

export class AuthService implements IAuthService {
  constructor(
    private _userRepository: IUserRepository,
    private _cryptoService: ICryptoService,
    private _tokenService: ITokenService
  ) { }


  private async generateTokens(user: UserDTO): Promise<{ newAccessToken: string; newRefreshToken: string }> {
    const [newAccessToken, newRefreshToken] = await Promise.all([
      this._tokenService.generateAccessToken(user),
      this._tokenService.generateRefreshToken(user)
    ]);
    return { newAccessToken, newRefreshToken };

  }

  async registerUser(email: string, password: string, roles: ("user" | "professional" | "admin")[]): Promise<UserDTO> {

    // handle otp sending 
    const hashedPassword = await this._cryptoService.hash(password);
    const user = await this._userRepository.create({ email, passwordHash: hashedPassword, roles });
    return user;
  }

  async loginUser(email: string, password: string): Promise<{ accessToken: string; refreshToken: string, user: UserDTO }> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

    if (!user.passwordHash) throw new AppError(ErrorMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    if (user.isBlocked) throw new AppError(ErrorMessage.BLOCKED_FROM_PLATFORM, HttpStatus.FORBIDDEN);

    const isPasswordValid = await this._cryptoService.compare(password, user.passwordHash);
    if (!isPasswordValid) throw new AppError(ErrorMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

    return {
      accessToken: this._tokenService.generateAccessToken(user),
      refreshToken: this._tokenService.generateRefreshToken(user),
      user,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
    const decoded = this._tokenService.verifyRefreshToken(refreshToken);
    const { id } = decoded;
    const user = await this._userRepository.findById(id);
    if (!user) throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

    const { newAccessToken, newRefreshToken } = await this.generateTokens(user)
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };

  }

  async googleAuthenticate(token: string): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }> {
    const decodedToken = this._tokenService.decodeGoogleToken(token);
    if (!decodedToken) throw new AppError(ErrorMessage.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);

    let user = await this._userRepository.findByEmail(decodedToken.email);
    if (!user) {
      user = await this._userRepository.create({ email: decodedToken.email, roles: ["user"], name: decodedToken.name, isVerified: true, googleId: decodedToken.sub, profilePicture: decodedToken.picture });
    } else if (!user.googleId) {
      const { id } = user;
      user = await this._userRepository.update(id, { googleId: decodedToken.sub });
      if (!user) {
        throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
    }

    const { newAccessToken, newRefreshToken } = await this.generateTokens(user)
    return {
      user,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  async initiatePasswordReset(email: string): Promise<void> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");
    const hashedPassword = await this._cryptoService.hash(newPassword);
    await this._userRepository.update(user.id, { passwordHash: hashedPassword });
  }

}
import { IUserRepository } from "../../domain/repositories/user.repository.interface";
import {
  ICryptoService,
  IAuthService,
  ITokenService,
  IOtpService,
} from "../../domain/services";
import { UserDTO } from "../../application/dtos/userDto";
import { AppError } from "../errors/AppError";
import { HttpStatus, ErrorMessage } from "../../common/enums";
import { IEventBus } from "../../domain/events/IEventBus";
import { buildOtpEmailHtml, OTP_SUBJECT, otpType } from "../utils/otp";
import { IOtpRepository } from "../../domain/repositories/otp.repository.interface";

export class AuthService implements IAuthService {
  constructor(
    private _userRepository: IUserRepository,
    private _otpRepository: IOtpRepository,
    private _cryptoService: ICryptoService,
    private _tokenService: ITokenService,
    private _otpService: IOtpService,
    private _eventBus: IEventBus,
  ) {}

  private async generateTokens(
    user: UserDTO,
  ): Promise<{ newAccessToken: string; newRefreshToken: string }> {
    const [newAccessToken, newRefreshToken] = await Promise.all([
      this._tokenService.generateAccessToken(user),
      this._tokenService.generateRefreshToken(user),
    ]);
    return { newAccessToken, newRefreshToken };
  }

  async registerUser(
    name: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<void> {
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser && existingUser?.isVerified)
      throw new AppError(
        ErrorMessage.EMAIL_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    if (existingUser && !existingUser?.isVerified)
      await this._userRepository.delete(existingUser.id);
    const hashedPassword = await this._cryptoService.hash(password);
    await this._userRepository.create({
      email,
      phone,
      name,
      passwordHash: hashedPassword,
    });
    const otp = await this._otpService.generateOtp();
    await this._otpRepository.saveOtp(otp, email, otpType.register, 300);
    const message = {
      to: email,
      subject: OTP_SUBJECT,
      text: buildOtpEmailHtml(otp, otpType.register),
    };
    await this._eventBus.publish("send.otp", message);
  }

  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }> {
    const savedOtp = await this._otpRepository.getOtp(email, otpType.register);
    if (!savedOtp)
      throw new AppError(ErrorMessage.OTP_NOT_FOUND, HttpStatus.NOT_FOUND);
    if (savedOtp !== otp) {
      await this._otpRepository.incrementCount(email, otpType.register);
      throw new AppError(ErrorMessage.INVALID_OTP, HttpStatus.UNAUTHORIZED);
    }
    const user = await this._userRepository.findByEmail(email)!;
    if (!user)
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

    await Promise.all([
      this._userRepository.update(user.id, { isVerified: true }),
      this._otpRepository.deleteOtp(email, otpType.register),
    ]);

    const { newAccessToken, newRefreshToken } = await this.generateTokens(user);
    const { passwordHash, isBlocked, isVerified, ...publicUser } = user;
    return {
      user: publicUser,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async loginUser(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: UserDTO }> {
    const user = await this._userRepository.findByEmail(email);
    if (!user || !user.isVerified)
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    if (!user.passwordHash)
      throw new AppError(
        ErrorMessage.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    if (user.isBlocked)
      throw new AppError(
        ErrorMessage.BLOCKED_FROM_PLATFORM,
        HttpStatus.FORBIDDEN,
      );
    const isPasswordValid = await this._cryptoService.compare(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid)
      throw new AppError(
        ErrorMessage.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    const { passwordHash, isBlocked, isVerified, googleId, ...publicUser } =
      user;
    return {
      accessToken: this._tokenService.generateAccessToken(user),
      refreshToken: this._tokenService.generateRefreshToken(user),
      user: publicUser,
    };
  }

  async resendRegisterOtp(email: string): Promise<void> {
    const user = await this._userRepository.findByEmail(email);
    if (!user)
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    await this._otpRepository.deleteOtp(email, otpType.register);
    const otp = await this._otpService.generateOtp();
    await this._otpRepository.saveOtp(otp, email, otpType.register, 300);
    const message = {
      to: email,
      subject: OTP_SUBJECT,
      text: buildOtpEmailHtml(otp, otpType.register),
    };
    await this._eventBus.publish("send.otp", message);
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded = this._tokenService.verifyRefreshToken(refreshToken);
    const { id } = decoded;
    const user = await this._userRepository.findById(id);
    if (!user)
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    if (user && user.isBlocked)
      throw new AppError(
        ErrorMessage.BLOCKED_FROM_PLATFORM,
        HttpStatus.FORBIDDEN,
      );

    const { newAccessToken, newRefreshToken } = await this.generateTokens(user);
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async googleAuthenticate(
    token: string,
  ): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }> {
    const decodedToken = this._tokenService.decodeGoogleToken(token);
    if (!decodedToken)
      throw new AppError(ErrorMessage.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);

    let user = await this._userRepository.findByEmail(decodedToken.email);
    if (!user) {
      user = await this._userRepository.create({
        email: decodedToken.email,
        name: decodedToken.name,
        isVerified: true,
        googleId: decodedToken.sub,
        profilePicture: decodedToken.picture,
      });
    } else if (!user.googleId) {
      const { id } = user;
      user = await this._userRepository.update(id, {
        googleId: decodedToken.sub,
      });
      if (!user) {
        throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
    }

    const { newAccessToken, newRefreshToken } = await this.generateTokens(user);
    return {
      user,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async initiatePasswordReset(email: string): Promise<void> {
    const user = await this._userRepository.findByEmail(email);
    if (!user)
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    const otp = await this._otpService.generateOtp();
    await this._otpRepository.saveOtp(otp, email, otpType.reset, 300);
    const message = {
      to: email,
      subject: OTP_SUBJECT,
      text: buildOtpEmailHtml(otp, otpType.reset),
    };
    await this._eventBus.publish("send.otp", message);
  }

  async verifyResetOtp(email: string, otp: string): Promise<void> {
    const savedOtp = await this._otpRepository.getOtp(email, otpType.reset);
    if (!savedOtp)
      throw new AppError(ErrorMessage.OTP_NOT_FOUND, HttpStatus.NOT_FOUND);
    if (savedOtp !== otp) {
      await this._otpRepository.incrementCount(email, otpType.reset);
      throw new AppError(ErrorMessage.INVALID_OTP, HttpStatus.UNAUTHORIZED);
    }
    await this._otpRepository.deleteOtp(email, otpType.reset);
  }

  async resendResetOtp(email: string): Promise<void> {
    const user = await this._userRepository.findByEmail(email);
    if (!user)
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    await this._otpRepository.deleteOtp(email, otpType.reset);
    const otp = await this._otpService.generateOtp();
    await this._otpRepository.saveOtp(otp, email, otpType.reset, 300);
    const message = {
      to: email,
      subject: OTP_SUBJECT,
      text: buildOtpEmailHtml(otp, otpType.reset),
    };
    await this._eventBus.publish("send.otp", message);
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    const user = await this._userRepository.findByEmail(email);
    if (!user)
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    const hashedPassword = await this._cryptoService.hash(newPassword);
    await this._userRepository.update(user.id, {
      passwordHash: hashedPassword,
    });
  }

  async isUserBlocked(userId: string): Promise<boolean> {
    const user = await this._userRepository.findById(userId);
    return user?.isBlocked || false;
  }
}

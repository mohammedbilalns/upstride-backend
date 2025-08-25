import { COOKIE_OPTIONS } from "../../../common/constants/cookieOptions";
import { HttpStatus, ResponseMessage } from "../../../common/enums";
import { IAuthService } from "../../../domain/services";
import asyncHandler from "../utils/asyncHandler";
import {
  loginSchema,
  registerSchema,
  verifyOtpSchema,
  updatePasswordSchema,
  resetSchema,
} from "../validations/auth.validation";
import env from "../../../infrastructure/config/env";
import { Response } from "express";

export class AuthController {
  constructor(private _authService: IAuthService) {}

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    res.cookie("accesstoken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: parseInt(env.ACCESS_TOKEN_EXPIRY),
    });
    res.cookie("refreshtoken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: parseInt(env.REFRESH_TOKEN_EXPIRY),
    });
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie("accesstoken");
    res.clearCookie("refreshtoken");
  }

  login = asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    const { user, accessToken, refreshToken } =
      await this._authService.loginUser(email, password);
    this.setAuthCookies(res, accessToken, refreshToken);
    res
      .status(HttpStatus.OK)
      .json({ success: true, message: ResponseMessage.LOGIN_SUCCESS, user });
  });

  register = asyncHandler(async (req, res) => {
    const { name, email, password } = registerSchema.parse(req.body);
    await this._authService.registerUser(name, email, password);
    res
      .status(HttpStatus.OK)
      .json({ success: true, messsage: ResponseMessage.OTP_SENT });
  });

  googleAuth = asyncHandler(async (req, res) => {
    const { credential } = req.body;
    const { user, accessToken, refreshToken } =
      await this._authService.googleAuthenticate(credential);
    this.setAuthCookies(res, accessToken, refreshToken);
    res
      .status(HttpStatus.OK)
      .json({ success: true, messsage: ResponseMessage.LOGIN_SUCCESS, user });
  });

  verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = verifyOtpSchema.parse(req.body);
    const { user, accessToken, refreshToken } =
      await this._authService.verifyOtp(email, otp);
    this.setAuthCookies(res, accessToken, refreshToken);
    res
      .status(HttpStatus.OK)
      .json({ success: true, messsage: ResponseMessage.OTP_VERIFIED, user });
  });

  logout = asyncHandler(async (_req, res) => {
    this.clearAuthCookies(res);
    res
      .status(HttpStatus.OK)
      .json({ success: true, messsage: ResponseMessage.LOGOUT_SUCCESS });
  });

  reset = asyncHandler(async (req, res) => {
    const { email } = resetSchema.parse(req.body);
    await this._authService.initiatePasswordReset(email);
    res
      .status(HttpStatus.OK)
      .json({ success: true, messsage: ResponseMessage.OTP_SENT });
  });

  verifyResetOtp = asyncHandler(async (req, res) => {
    const { email, otp } = verifyOtpSchema.parse(req.body);
    await this._authService.verifyResetOtp(email, otp);
    res
      .status(HttpStatus.OK)
      .json({ success: true, messsage: ResponseMessage.OTP_VERIFIED });
  });

  updatePassword = asyncHandler(async (req, res) => {
    const { email, newPassword } = updatePasswordSchema.parse(req.body);
    await this._authService.updatePassword(email, newPassword);
    res
      .status(HttpStatus.OK)
      .json({ success: true, messsage: ResponseMessage.PASSWORD_UPDATED });
  });
}

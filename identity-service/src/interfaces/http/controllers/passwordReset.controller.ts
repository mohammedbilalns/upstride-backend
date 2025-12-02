import { COOKIE_OPTIONS } from "../../../common/constants/cookieOptions";
import { HttpStatus, ResponseMessage } from "../../../common/enums";
import {
	IInitiatePasswordResetUC,
	IResendResetOtpUC,
	IUpdatePasswordUC,
	IVerifyResetOtpUC,
} from "../../../domain/useCases/resetUserPassword";
import env from "../../../infrastructure/config/env";
import asyncHandler from "../utils/asyncHandler";
import {
	resendOtpSchema,
	resetSchema,
	updatePasswordSchema,
	verifyOtpSchema,
} from "../validations/auth.validation";
import { Response } from "express";

export class PasswordResetController {
	constructor(
		private _initiatePasswordResetUC: IInitiatePasswordResetUC,
		private _resendResetOtpUC: IResendResetOtpUC,
		private _verifyResetOtpUC: IVerifyResetOtpUC,
		private _updatePasswordUC: IUpdatePasswordUC,
	) {}

	/** Sets registration or reset OTP token cookie */
	private setTokenCookie(
		res: Response,
		type: "reset" | "register",
		token: string,
	) {
		const cookieName = type === "reset" ? "resettoken" : "registertoken";
		res.cookie(cookieName, token, {
			...COOKIE_OPTIONS,
			maxAge: parseInt(env.RESET_TOKEN_EXPIRY),
		});
	}

	/** Clears reset OTP cookies */
	private clearTokenCookie(res: Response, type: "reset" | "register") {
		res.clearCookie(type === "reset" ? "resettoken" : "registertoken");
	}

	/** Initiate password reset → send OTP */
	public reset = asyncHandler(async (req, res) => {
		const { email } = resetSchema.parse(req.body);

		await this._initiatePasswordResetUC.execute(email);

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.OTP_SENT });
	});

	/** Resend password reset OTP */
	public resendResetOtp = asyncHandler(async (req, res) => {
		const { email } = resendOtpSchema.parse(req.body);

		await this._resendResetOtpUC.execute(email);

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.OTP_SENT });
	});

	/** Verify password reset OTP */
	public verifyResetOtp = asyncHandler(async (req, res) => {
		const parsedPayload = verifyOtpSchema.parse(req.body);

		const token = await this._verifyResetOtpUC.execute(parsedPayload);

		this.setTokenCookie(res, "reset", token);

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.OTP_VERIFIED });
	});

	/** Update password after reset */
	public updatePassword = asyncHandler(async (req, res) => {
		const resetToken = req.cookies.resettoken;

		const parsedPayload = updatePasswordSchema.parse(req.body);

		await this._updatePasswordUC.execute({ ...parsedPayload, resetToken });

		this.clearTokenCookie(res, "reset");

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.PASSWORD_UPDATED });
	});
}

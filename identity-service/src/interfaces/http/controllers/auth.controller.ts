import { HttpStatus, ResponseMessage } from "../../../common/enums";
import { IAuthService } from "../../../domain/services";
import asyncHandler from "../utils/asyncHandler";
import { loginSchema, registerSchema } from "../validations/auth.validation";



export  class AuthController {
  constructor(private _authService: IAuthService) { }

  login = asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse( req.body)
    const user = await this._authService.loginUser(email, password)
    res.status(HttpStatus.OK).json({ message: ResponseMessage.LOGIN_SUCCESS, user })
  })

  register = asyncHandler(async (req, res) => {
    const { name, email, password } = registerSchema.parse( req.body)
    await this._authService.registerUser(name, email,password)	
		res.status(HttpStatus.OK).json(ResponseMessage.OTP_SUCCESS)
  }
  )
}

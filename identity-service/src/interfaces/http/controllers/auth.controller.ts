import { AuthService } from "../../../application/services/auth.service";
import { HttpStatus, ResponseMessage } from "../../../common/enums";
import asyncHandler from "../utils/asyncHandler";



export  class AuthController {
  constructor(private _authService: AuthService) { }

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await this._authService.loginUser(email, password)
    res.status(HttpStatus.OK).json({ message: ResponseMessage.LOGIN_SUCCESS, user })
  })
}
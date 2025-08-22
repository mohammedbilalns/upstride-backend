import { IOtpService } from "../../domain/services/otp.service.interface";



export class OtpService implements IOtpService {

  async generateOtp(): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  }
}
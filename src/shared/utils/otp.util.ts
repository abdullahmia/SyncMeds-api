import * as generator from "otp-generator";

export class OtpGenerator {
  constructor() {}

  async generateOtp(options?: {
    length?: number;
    onlyNumbers?: boolean;
    onlyChars?: boolean;
  }): Promise<string> {
    const {
      length = 6,
      onlyNumbers = false,
      onlyChars = false,
    } = options || {};

    let config = {
      digits: true,
      lowerCaseAlphabets: true,
      upperCaseAlphabets: false,
      specialChars: false,
    };

    if (onlyNumbers) {
      config = {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      };
    } else if (onlyChars) {
      config = {
        digits: false,
        lowerCaseAlphabets: true,
        upperCaseAlphabets: false,
        specialChars: false,
      };
    }

    return generator.generate(length, config);
  }
}

export const otpGenerator = new OtpGenerator();

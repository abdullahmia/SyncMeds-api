import { emailService } from "../email.service";

export class AuthEmailSender {
  async sendPasswordReset(to: string, otp: string): Promise<void> {
    await emailService.send({
      to,
      subject: "Password Reset Request",
      template: "auth/reset-password",
      context: {
        otp,
      },
    });
  }

  async sendWelcome(to: string, name: string): Promise<void> {
    await emailService.send({
      to,
      subject: "Welcome to Our Platform",
      template: "auth/welcome",
      context: { name },
    });
  }
}

export const authEmailSender = new AuthEmailSender();

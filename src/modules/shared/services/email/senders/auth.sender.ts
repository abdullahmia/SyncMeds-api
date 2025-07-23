import config from "@/config";
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

  async sendResetPasswordSuccessful(to: string, name: string): Promise<void> {
    await emailService.send({
      to,
      subject: "Password successfully reset",
      template: "auth/password-reset-success",
      context: {
        name: name,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        }),
        loginUrl: `${config.clientUrl}/login`,
        email: to,
        year: new Date().getFullYear(),
      },
    });
  }
}

export const authEmailSender = new AuthEmailSender();

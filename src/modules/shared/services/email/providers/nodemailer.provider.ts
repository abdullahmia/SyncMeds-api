import config from "@/config";
import { logger } from "@/shared/utils/logger.util";
import nodemailer, { Transporter } from "nodemailer";
import { SentMessageInfo } from "nodemailer/lib/smtp-transport";

export interface EmailProvider {
  sendMail(options: MailOptions): Promise<SentMessageInfo>;
  verifyConnection(): Promise<void>;
}

export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class NodemailerProvider implements EmailProvider {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: config.email.smtp.service,
      auth: {
        user: config.email.smtp.auth.user,
        pass: config.email.smtp.auth.pass,
      },
    });
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.transporter.on("error", (error: unknown) => {
      logger.error("Nodemailer transport error:", error);
    });
  }

  async sendMail(options: MailOptions): Promise<SentMessageInfo> {
    try {
      const info = await this.transporter.sendMail({
        ...options,
        from: options.from,
      });

      if (config.env === "development") {
        logger.debug(`Email sent: ${info.messageId}`);
        logger.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }

      return info;
    } catch (error) {
      console.log("Sending email error --> ", error);
      logger.error("Failed to send email:", error);
      throw new Error(
        `Email sending failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      logger.info("Nodemailer connection verified");
    } catch (error) {
      logger.error("Nodemailer connection verification failed:", error);
      throw new Error("Email server connection failed");
    }
  }
}

export const nodemailerProvider = new NodemailerProvider();

if (config.env === "production") {
  nodemailerProvider.verifyConnection().catch(() => {
    process.exitCode = 1;
  });
}

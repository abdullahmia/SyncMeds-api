import config from "@/config";
import { logger } from "@/shared/utils/logger.util";
import nodemailer, { Transporter } from "nodemailer";
import { SentMessageInfo } from "nodemailer/lib/smtp-transport";
import { Token } from "nodemailer/lib/xoauth2";

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
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: false,
      auth: undefined,
      tls: {
        rejectUnauthorized: false,
      },
      // secure: config.email.smtp.secure,
      // auth:
      //   config.env === "production"
      //     ? {
      //         user: config.email.smtp.auth.user,
      //         pass: config.email.smtp.auth.pass,
      //       }
      //     : undefined,
      // tls: {
      //   rejectUnauthorized: config.env === "production",
      // },
      logger: config.env === "development",
      debug: config.env === "development",
    });
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.transporter.on("token", (token: Token) => {
      logger.debug(`Nodemailer OAuth token: ${token}`);
    });

    this.transporter.on("error", (error: unknown) => {
      logger.error("Nodemailer transport error:", error);
    });
  }

  async sendMail(options: MailOptions): Promise<SentMessageInfo> {
    try {
      const info = await this.transporter.sendMail({
        ...options,
        // from: options.from || `"${config.email.from}" <${config.email.from}>`,
        from: options.from,
      });

      if (config.env === "development") {
        logger.debug(`Email sent: ${info.messageId}`);
        logger.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }

      return info;
    } catch (error) {
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

// Singleton instance (optional, can also use dependency injection)
export const nodemailerProvider = new NodemailerProvider();

// Verify connection on startup in production
if (config.env === "production") {
  nodemailerProvider.verifyConnection().catch(() => {
    process.exitCode = 1;
  });
}
